// ─── OTP ────────────────────────────────────────────────────────
export function generateOtpCode(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const num =
    (bytes[0] * 16777216 + bytes[1] * 65536 + bytes[2] * 256 + bytes[3]) %
    900000;
  return String(num + 100000);
}

export function getTokenExpiresAt(minutes: number = 15): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

// ─── Token seguro para links ────────────────────────────────────
export function generateSecureToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
