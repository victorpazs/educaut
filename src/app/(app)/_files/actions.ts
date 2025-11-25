"use server";

import * as AWS from "aws-sdk";
import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/session";
import {
  createErrorResponse,
  createSuccessResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";

import type { ISchoolFile } from "./_models";
import https from "https";

const spacesEndpoint = new AWS.Endpoint("s3.1app.com.br");

const s3 = new AWS.S3({
  accessKeyId: "ATICAS3S3RVER2023",
  secretAccessKey: "d0626d4a0abfaf7cc56eb2105ed5de7c",
  endpoint: spacesEndpoint,
  sslEnabled: false,
  httpOptions: {
    agent: new https.Agent({ rejectUnauthorized: false }),
  },
  s3ForcePathStyle: true,
  region: "sa-east-1",
  signatureVersion: "v4",
});

function getContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const contentTypes: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
    pdf: "application/pdf",
    txt: "text/plain",
    csv: "text/csv",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    mp4: "video/mp4",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    json: "application/json",
  };
  return contentTypes[ext] || "application/octet-stream";
}

function getFileExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return ext || "bin";
}

function getFileNameWithoutExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) return filename;
  return filename.substring(0, lastDotIndex);
}

function sanitizeFileName(filename: string): string {
  // Remove caracteres especiais e espaços, mantendo apenas letras, números, hífens e underscores
  return filename
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

function generateRandomHash(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

/**
 * Gera link assinado para upload de imagem no S3 sem salvar na tabela files
 * Função reutilizável para uploads diretos de imagens
 * Segue o mesmo padrão de generateUploadLink, mas sem criar registro na tabela
 */
export async function uploadImageToS3(
  fileName: string,
  fileSize: number,
  contentType: string
): Promise<
  ApiResponse<{
    uploadUrl: string;
    url: string;
  } | null>
> {
  try {
    if (!contentType.startsWith("image/")) {
      return createErrorResponse(
        "Arquivo inválido. Selecione uma imagem.",
        "INVALID_FILE_TYPE",
        400
      );
    }

    const fileExtension = getFileExtension(fileName);
    const randomString = generateRandomHash();
    const randomFileName = `${randomString}.${fileExtension}`;

    // Bucket padrão para uploads gerais (sem associação a escola)
    const bucket = "educaut";
    const key = `uploads/${randomFileName}`;

    const expires = 60 * 5; // 5 minutos

    // Gerar URL assinada para upload
    const signedUrl = s3.getSignedUrl("putObject", {
      Bucket: bucket,
      Key: key,
      ACL: "public-read",
      Expires: expires,
      ContentType: contentType,
    });

    // Construir URL pública (sem query parameters)
    const publicUrl = signedUrl.split("?")[0];

    return createSuccessResponse(
      {
        uploadUrl: signedUrl,
        url: publicUrl,
      },
      "Link de upload gerado com sucesso."
    );
  } catch (error: unknown) {
    console.error("Erro ao gerar link de upload:", error);

    const err = error as { code?: string; statusCode?: number };
    if (err.code === "XMLParserError" || err.statusCode === 502) {
      return createErrorResponse(
        `Erro ao conectar com o servidor S3. Endpoint: s3.1app.com.br`,
        "S3_CONNECTION_ERROR",
        502
      );
    }

    if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
      return createErrorResponse(
        `Não foi possível conectar ao servidor S3 em s3.1app.com.br`,
        "S3_ENDPOINT_UNREACHABLE",
        503
      );
    }

    return handleServerError(error);
  }
}

export async function getSchoolFiles(): Promise<
  ApiResponse<ISchoolFile[] | null>
> {
  try {
    const { school } = await getAuthContext();
    const schoolId = school?.id;

    if (!schoolId) {
      return createErrorResponse(
        "Nenhuma escola selecionada.",
        "SCHOOL_NOT_SELECTED",
        400
      );
    }

    const files = await prisma.files.findMany({
      where: {
        school_id: schoolId,
        status: 1,
      },
      orderBy: {
        created_at: "desc",
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

    return createSuccessResponse(files, "Arquivos carregados com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}

export async function generateUploadLink(
  fileName: string,
  fileSize: number,
  contentType: string
): Promise<
  ApiResponse<{
    uploadUrl: string;
    fileId: number;
    url: string;
  } | null>
> {
  try {
    const { school } = await getAuthContext();
    const schoolId = school?.id;

    if (!schoolId) {
      return createErrorResponse(
        "Nenhuma escola selecionada.",
        "SCHOOL_NOT_SELECTED",
        400
      );
    }

    const fileExtension = getFileExtension(fileName);

    const randomString = generateRandomHash();
    const randomFileName = `${randomString}.${fileExtension}`;

    const folder = schoolId ? `/project_${schoolId}` : "";
    const bucket = `educaut${folder || "/schools"}`;

    const expires = 60 * 5;

    const signedUrl = s3.getSignedUrl("putObject", {
      Bucket: bucket,
      Key: randomFileName,
      ACL: "public-read",
      Expires: expires,
      ContentType: contentType,
    });

    const publicUrl = signedUrl.split("?")[0];

    const fileRecord = await prisma.files.create({
      data: {
        school_id: schoolId,
        type: fileExtension,
        size: fileSize,
        url: publicUrl,
        status: 0,
      },
      select: {
        id: true,
      },
    });

    return createSuccessResponse(
      {
        uploadUrl: signedUrl,
        fileId: fileRecord.id,
        url: publicUrl,
      },
      "Link de upload gerado com sucesso."
    );
  } catch (error: unknown) {
    console.error("Erro ao gerar link de upload:", error);

    const err = error as { code?: string; statusCode?: number };
    if (err.code === "XMLParserError" || err.statusCode === 502) {
      return createErrorResponse(
        `Erro ao conectar com o servidor S3. Endpoint: s3.1app.com.br`,
        "S3_CONNECTION_ERROR",
        502
      );
    }

    return handleServerError(error);
  }
}

export async function confirmUpload(
  fileId: number
): Promise<ApiResponse<ISchoolFile | null>> {
  try {
    const { school } = await getAuthContext();
    const schoolId = school?.id;

    if (!schoolId) {
      return createErrorResponse(
        "Nenhuma escola selecionada.",
        "SCHOOL_NOT_SELECTED",
        400
      );
    }

    // Atualizar registro no banco com status completo
    // A URL já foi salva no generateUploadLink (como no s3rver.js)
    const savedFile = await prisma.files.update({
      where: {
        id: fileId,
        school_id: schoolId, // Garantir que o arquivo pertence à escola
      },
      data: {
        status: 1, // 1 = completo
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
      savedFile,
      "Arquivo confirmado com sucesso.",
      200
    );
  } catch (error) {
    console.error("Erro ao confirmar upload:", error);
    return handleServerError(error);
  }
}

export async function deleteSchoolFile(
  fileId: number
): Promise<ApiResponse<ISchoolFile | null>> {
  try {
    const { school } = await getAuthContext();
    const schoolId = school?.id;

    if (!schoolId) {
      return createErrorResponse(
        "Nenhuma escola selecionada.",
        "SCHOOL_NOT_SELECTED",
        400
      );
    }

    // Atualizar status para 3 (removido)
    const deletedFile = await prisma.files.update({
      where: {
        id: fileId,
        school_id: schoolId, // Garantir que o arquivo pertence à escola
      },
      data: {
        status: 3, // 3 = removido
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
      200
    );
  } catch (error) {
    console.error("Erro ao remover arquivo:", error);
    return handleServerError(error);
  }
}
