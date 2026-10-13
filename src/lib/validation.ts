export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 8;

// Nigerian numbers: 080..., +234 80..., 234 80... (spaces/dashes allowed)
export function isValidPhone(phone: string) {
  const digits = phone.replace(/[\s-]/g, '');
  return /^(\+?234|0)[789][01]\d{8}$/.test(digits);
}
