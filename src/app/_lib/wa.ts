export function normalizeWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  if (digits.length === 0) return "";

  // 0xxxxxxxxxx -> 62xxxxxxxxxx
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;

  // 8xxxxxxxxxx -> 62xxxxxxxxxx
  if (digits.startsWith("8")) return `62${digits}`;

  // already country code (62...)
  return digits;
}

export function buildWhatsAppLink(rawNumber: string, message: string): string {
  const number = normalizeWhatsAppNumber(rawNumber);
  const text = message.trim();

  if (!number) return "";
  if (!text) return `https://wa.me/${number}`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
