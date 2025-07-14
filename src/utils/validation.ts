// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation with requirements
export const validatePassword = (password: string): {
  isValid: boolean;
  message: string;
} => {
  if (!password) {
    return { isValid: false, message: 'Wachtwoord is vereist' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Minimaal 8 karakters vereist' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Minimaal 1 hoofdletter vereist' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Minimaal 1 cijfer vereist' };
  }
  
  return { isValid: true, message: 'Sterk wachtwoord' };
};

// Phone number validation (Dutch format)
export const validatePhoneNumber = (phone: string): boolean => {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '');
  
  // Dutch phone number patterns
  const dutchPhoneRegex = /^(\+31|0031|0)[1-9][0-9]{8}$/;
  return dutchPhoneRegex.test(cleaned);
};

// Name validation
export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

// Postal code validation (Dutch format)
export const validatePostalCode = (postalCode: string): boolean => {
  const dutchPostalCodeRegex = /^[1-9][0-9]{3}\s?[A-Z]{2}$/i;
  return dutchPostalCodeRegex.test(postalCode);
};

// Credit card validation (basic Luhn algorithm)
export const validateCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (!/^\d+$/.test(cleaned)) return false;
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// URL validation
export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Date validation
export const validateDate = (date: Date, minAge?: number): boolean => {
  const now = new Date();
  
  if (date > now) {
    return false; // Future date
  }
  
  if (minAge) {
    const ageDate = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
    return date <= ageDate;
  }
  
  return true;
};

// IBAN validation (simplified)
export const validateIBAN = (iban: string): boolean => {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  
  // Basic length check for Dutch IBAN
  if (cleaned.length !== 18 || !cleaned.startsWith('NL')) {
    return false;
  }
  
  // Check if it contains only alphanumeric characters
  return /^[A-Z0-9]+$/.test(cleaned);
};

// Generic required field validation
export const validateRequired = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// Number range validation
export const validateNumberRange = (
  value: number,
  min?: number,
  max?: number
): boolean => {
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
};