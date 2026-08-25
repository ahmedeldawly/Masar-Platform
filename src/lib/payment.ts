export function normalizeCardNumber(value: string) {
  return value.replace(/\s+/g, "").replace(/[^\d]/g, "");
}

export function isValidVisaCardNumber(value: string) {
  const digits = normalizeCardNumber(value);
  if (!/^4\d{12,18}$/.test(digits)) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export function isValidExpiry(expiry: string) {
  const value = expiry.trim();
  const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/);
  if (!match) return false;

  const month = Number(match[1]);
  const yearSource = match[2];
  const year = yearSource.length === 2 ? 2000 + Number(yearSource) : Number(yearSource);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return month >= 1 && month <= 12;
}

export function isValidCvv(value: string) {
  return /^\d{3,4}$/.test(value.trim());
}
