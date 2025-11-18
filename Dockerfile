# Etapa de deps/build
FROM node:20-slim AS builder
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Habilita pnpm via corepack (melhor que instalar globalmente)
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copia só o necessário para cache eficiente
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copia o restante do código
COPY . .

# Não roda migrações. Se precisar gerar client do Prisma, faça manualmente.
# RUN pnpm prisma generate

# Build do Next.js
RUN pnpm build


# Etapa de runtime (imagem menor / segura)
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOST=0.0.0.0

# Copia apenas o necessário para rodar
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

# Usuário não-root
USER node

EXPOSE 3000
CMD ["pnpm", "start", "-p", "3000", "-H", "0.0.0.0"]