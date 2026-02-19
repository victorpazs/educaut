"use server";

import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/session";
import {
  createErrorResponse,
  createSuccessResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";
import { getFileExtension } from "@/lib/utils";
import type { ISchoolFile } from "./_models";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BASE_FOLDER = process.env.BASE_FOLDER!;

/**
 * Função genérica para upload de arquivos ao S3 usando @aws-sdk/lib-storage.
 * Suporta multipart upload automático para arquivos grandes.
 * @param file Arquivo (File ou Buffer)
 * @param subFolder Subpasta dentro do bucket (ex: 'uploads', 'school_1')
 */
async function uploadToS3(
  file: File,
  subFolder: string,
): Promise<{ url: string; key: string }> {
  const fileExtension = getFileExtension(file.name);
  const uniqueName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
  const fileKey = `${BASE_FOLDER}/${subFolder}/${uniqueName}`;

  const parallelUpload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey,
      Body: file,
      ContentType: file.type || "application/octet-stream",
    },
    queueSize: 4,
    partSize: 1024 * 1024 * 5, // 5MB por parte
    leavePartsOnError: false,
  });

  parallelUpload.on("httpUploadProgress", (progress) => {
    if (progress.loaded && progress.total) {
      const percentage = Math.round((progress.loaded / progress.total) * 100);
      console.log(`[S3 Upload] ${file.name}: ${percentage}%`);
    }
  });

  await parallelUpload.done();

  const publicUrl = `${process.env.S3_PUBLIC_URL}/${fileKey}`;
  return { url: publicUrl, key: fileKey };
}

// ──────────────────────────────────────────────────
// Upload de imagem (sem registro na tabela files)
// ──────────────────────────────────────────────────

export async function uploadImageToS3(
  formData: FormData,
): Promise<ApiResponse<{ url: string } | null>> {
  try {
    const file = formData.get("file") as File | null;

    if (!file) {
      return createErrorResponse(
        "Nenhum arquivo enviado.",
        "MISSING_FILE",
        400,
      );
    }

    if (!file.type.startsWith("image/")) {
      return createErrorResponse(
        "Arquivo inválido. Selecione uma imagem.",
        "INVALID_FILE_TYPE",
        400,
      );
    }

    const { url } = await uploadToS3(file, "uploads");

    return createSuccessResponse({ url }, "Imagem enviada com sucesso.");
  } catch (error: unknown) {
    console.error("Erro ao fazer upload de imagem:", error);

    const err = error as { code?: string; statusCode?: number };
    if (err.code === "XMLParserError" || err.statusCode === 502) {
      return createErrorResponse(
        `Erro ao conectar com o servidor S3. Endpoint: ${process.env.AWS_S3_ENDPOINT}`,
        "S3_CONNECTION_ERROR",
        502,
      );
    }

    if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
      return createErrorResponse(
        `Não foi possível conectar ao servidor S3 em ${process.env.AWS_S3_ENDPOINT}`,
        "S3_ENDPOINT_UNREACHABLE",
        503,
      );
    }

    return handleServerError(error);
  }
}

// ──────────────────────────────────────────────────
// Upload de arquivo escolar (cria registro na tabela files)
// ──────────────────────────────────────────────────

export async function uploadSchoolFile(
  formData: FormData,
): Promise<ApiResponse<{ fileId: number; url: string } | null>> {
  try {
    const { school } = await getAuthContext();
    const schoolId = school?.id;

    if (!schoolId) {
      return createErrorResponse(
        "Nenhuma escola selecionada.",
        "SCHOOL_NOT_SELECTED",
        400,
      );
    }

    const file = formData.get("file") as File | null;

    if (!file) {
      return createErrorResponse(
        "Nenhum arquivo enviado.",
        "MISSING_FILE",
        400,
      );
    }

    const fileExtension = getFileExtension(file.name);
    const { url } = await uploadToS3(file, `school_${schoolId}`);

    const fileRecord = await prisma.files.create({
      data: {
        school_id: schoolId,
        type: fileExtension,
        size: file.size,
        url,
        status: 1,
      },
      select: { id: true },
    });

    return createSuccessResponse(
      { fileId: fileRecord.id, url },
      "Arquivo enviado com sucesso.",
    );
  } catch (error: unknown) {
    console.error("Erro ao fazer upload de arquivo:", error);

    const err = error as { code?: string; statusCode?: number };
    if (err.code === "XMLParserError" || err.statusCode === 502) {
      return createErrorResponse(
        `Erro ao conectar com o servidor S3. Endpoint: ${process.env.AWS_S3_ENDPOINT}`,
        "S3_CONNECTION_ERROR",
        502,
      );
    }

    return handleServerError(error);
  }
}

// ──────────────────────────────────────────────────
// Listagem de arquivos com paginação
// ──────────────────────────────────────────────────

export interface GetSchoolFilesParams {
  page?: number;
  limit?: number;
  search?: string;
  fileTypes?: string[];
}

export interface GetSchoolFilesResponse {
  files: ISchoolFile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getSchoolFiles(
  params: GetSchoolFilesParams = {},
): Promise<ApiResponse<GetSchoolFilesResponse | null>> {
  try {
    const { school } = await getAuthContext();
    const schoolId = school?.id;

    if (!schoolId) {
      return createErrorResponse(
        "Nenhuma escola selecionada.",
        "SCHOOL_NOT_SELECTED",
        400,
      );
    }

    const page = params.page ?? 1;
    const limit = params.limit ?? 12;
    const skip = (page - 1) * limit;
    const normalizedSearch = params.search?.trim();
    const fileTypes = params.fileTypes
      ?.filter(Boolean)
      .map((type) => type.toLowerCase().replace(/^\./, ""));

    const whereClause = {
      school_id: schoolId,
      status: 1,
      ...(normalizedSearch
        ? {
            url: {
              contains: normalizedSearch,
              mode: "insensitive" as const,
            },
          }
        : {}),
      ...(fileTypes && fileTypes.length > 0
        ? {
            type: {
              in: fileTypes,
            },
          }
        : {}),
    };

    const [files, total] = await Promise.all([
      prisma.files.findMany({
        where: whereClause,
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: limit,
        select: {
          id: true,
          type: true,
          size: true,
          url: true,
          status: true,
          created_at: true,
        },
      }),
      prisma.files.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return createSuccessResponse(
      {
        files,
        total,
        page,
        limit,
        totalPages,
      },
      "Arquivos carregados com sucesso.",
    );
  } catch (error) {
    return handleServerError(error);
  }
}

// ──────────────────────────────────────────────────
// Deleção de arquivo (soft delete)
// ──────────────────────────────────────────────────

export async function deleteSchoolFile(
  fileId: number,
): Promise<ApiResponse<ISchoolFile | null>> {
  try {
    const { school } = await getAuthContext();
    const schoolId = school?.id;

    if (!schoolId) {
      return createErrorResponse(
        "Nenhuma escola selecionada.",
        "SCHOOL_NOT_SELECTED",
        400,
      );
    }

    const deletedFile = await prisma.files.update({
      where: {
        id: fileId,
        school_id: schoolId,
      },
      data: {
        status: 3,
      },
      select: {
        id: true,
        type: true,
        size: true,
        url: true,
        status: true,
        created_at: true,
      },
    });

    return createSuccessResponse(
      deletedFile,
      "Arquivo removido com sucesso.",
      200,
    );
  } catch (error) {
    console.error("Erro ao remover arquivo:", error);
    return handleServerError(error);
  }
}
