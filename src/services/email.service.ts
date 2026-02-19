"use server";

import nodemailer from "nodemailer";
import Handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { checkRateLimit } from "@/lib/rate-limit";

// ─── Transporter ────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ─── Templates ──────────────────────────────────────────────────
const templateCache = new Map<string, HandlebarsTemplateDelegate>();

function compileTemplate(templateName: string): HandlebarsTemplateDelegate {
  const cached = templateCache.get(templateName);
  if (cached) return cached;

  const templatePath = path.join(
    process.cwd(),
    "src",
    "lib",
    "templates",
    `${templateName}.hbs`,
  );
  const source = fs.readFileSync(templatePath, "utf-8");
  const compiled = Handlebars.compile(source);
  templateCache.set(templateName, compiled);
  return compiled;
}

// ─── Envio base ─────────────────────────────────────────────────
async function sendEmail(to: string, subject: string, html: string) {
  if (!checkRateLimit("global:email", "global")) {
    throw new Error("Limite global de e-mails atingido. Tente mais tarde.");
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@educaut.com",
    to,
    subject,
    html,
  });
}

// ─── Emails ─────────────────────────────────────────────────────
export async function sendOtpEmail(email: string, code: string) {
  const template = compileTemplate("verify-email");
  const html = template({ code });

  await sendEmail(email, "Seu código de verificação — EducAut", html);
}

export async function sendPasswordRecoveryEmail(
  email: string,
  userName: string,
  resetLink: string,
) {
  const template = compileTemplate("password-recovery");
  const html = template({ userName, resetLink });

  await sendEmail(email, "Redefinição de senha — EducAut", html);
}
