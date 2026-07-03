export function isValidEmail(value = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhone(value = "") {
  return /^[0-9+\s().-]{8,20}$/.test(value.trim());
}

export function required(value = "", min = 1) {
  return value && value.trim().length >= min;
}

/** Coupe/échappe pour éviter tout souci d'injection dans les e-mails HTML. */
export function clean(value = "", maxLen = 500) {
  return String(value).trim().slice(0, maxLen);
}
