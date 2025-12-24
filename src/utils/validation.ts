export const isValidEmail = (email: string): boolean => {
  // simple + safe email check (good enough for client-side validation)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
};

export const isValidPhone = (phone: string): boolean => {
  // accepts 10-15 digits, allows spaces/dashes/() and +
  const digits = String(phone).replace(/[^0-9]/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

export const validatePassword = (password: string): boolean => {
  // at least 6 chars
  return String(password).length >= 6;
}; 
