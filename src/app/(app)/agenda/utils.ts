export function toDate(value: Date | string): Date | null {
  const d = value instanceof Date ? value : new Date(value);
  return d instanceof Date && !isNaN(d.getTime()) ? d : null;
}

export function validateScheduleTimes(
  start: Date | string,
  end: Date | string
):
  | {
      valid: true;
      start: Date;
      end: Date;
    }
  | {
      valid: false;
      message: string;
    } {
  const startDate = toDate(start);
  if (!startDate) {
    return { valid: false, message: "Data de início inválida." };
  }
  const endDate = toDate(end);
  if (!endDate) {
    return { valid: false, message: "Data de fim inválida." };
  }
  if (startDate.getTime() >= endDate.getTime()) {
    return {
      valid: false,
      message: "A data de início deve ser anterior à data de fim.",
    };
  }
  return { valid: true, start: startDate, end: endDate };
}

export function normalizeRequiredTitle(title?: string | null):
  | {
      ok: true;
      value: string;
    }
  | {
      ok: false;
      message: string;
    } {
  const value = (title ?? "").trim();
  if (!value) {
    return { ok: false, message: "Título é obrigatório." };
  }
  return { ok: true, value };
}

function withTime(base: Date, hours: number, minutes = 0) {
  return new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate(),
    hours,
    minutes,
    0,
    0
  );
}

export function getAllDayRange(base: Date): { start: Date; end: Date } {
  // Considera jornada padrão escolar
  const start = withTime(base, 8, 0);
  const end = withTime(base, 18, 0);
  return { start, end };
}

export function getMorningRange(base: Date): { start: Date; end: Date } {
  const start = withTime(base, 8, 0);
  const end = withTime(base, 12, 0);
  return { start, end };
}

export function getAfternoonRange(base: Date): { start: Date; end: Date } {
  const start = withTime(base, 13, 0);
  const end = withTime(base, 18, 0);
  return { start, end };
}
