export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getAge(date: Date | null | undefined) {
  if (!date) return null;
  const now = new Date();
  const birth = new Date(date);

  if (birth > now) return "0 dias";

  let years = now.getFullYear() - birth.getFullYear();
  const hasNotHadBirthdayThisYear =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (hasNotHadBirthdayThisYear) years -= 1;
  if (years >= 1) {
    return years === 1 ? "1 ano" : `${years} anos`;
  }

  let months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) {
    months -= 1;
  }
  if (months >= 1) {
    return months === 1 ? "1 mês" : `${months} meses`;
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.max(
    0,
    Math.floor((now.getTime() - birth.getTime()) / msPerDay)
  );
  const weeks = Math.floor(diffDays / 7);
  if (weeks >= 1) {
    return weeks === 1 ? "1 semana" : `${weeks} semanas`;
  }

  const days = diffDays;
  return days === 1 ? "1 dia" : `${days} dias`;
}

export function formatDateTimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function parseDateTimeLocal(value: string): Date {
  const [datePart, timePart] = value.split("T");
  const [y, m, d] = datePart.split("-").map((v) => Number(v));
  const [hh, mm] = timePart.split(":").map((v) => Number(v));
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

export function getFileExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return ext || "bin";
}
