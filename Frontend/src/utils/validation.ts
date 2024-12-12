// validation.ts

/**
 * Validates if a field is non-empty.
 * @param value - Value to validate.
 * @returns Validation result.
 */
export function isRequired(value: string | null | undefined): string | true {
    return value?.trim() ? true : "This field is required.";
  }
  
  /**
   * Validates if an email is in the correct format.
   * @param email - Email string to validate.
   * @returns Validation result.
   */
  export function validateEmail(email: string): string | true {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? true : "Enter a valid email address.";
  }
  
  /**
   * Validates if a string matches a given length range.
   * @param value - Value to validate.
   * @param min - Minimum length.
   * @param max - Maximum length.
   * @returns Validation result.
   */
  export function validateLength(value: string, min = 1, max = 255): string | true {
    const length = value.trim().length;
    if (length < min) return `Minimum length is ${min} characters.`;
    if (length > max) return `Maximum length is ${max} characters.`;
    return true;
  }
  
  /**
   * Validates if a number is within a specific range.
   * @param value - Number to validate.
   * @param min - Minimum allowed value.
   * @param max - Maximum allowed value.
   * @returns Validation result.
   */
  export function validateRange(value: number, min: number, max: number): string | true {
    if (value < min) return `Value must be at least ${min}.`;
    if (value > max) return `Value must not exceed ${max}.`;
    return true;
  }
  
  /**
   * Validates if a date is in the future.
   * @param date - Date to validate.
   * @returns Validation result.
   */
  export function validateFutureDate(date: string | Date): string | true {
    const currentDate = new Date();
    const targetDate = new Date(date);
    return targetDate > currentDate ? true : "The date must be in the future.";
  }
  
  /**
   * Validates if an enum value is allowed.
   * @param value - Value to validate.
   * @param allowedValues - Array of allowed enum values.
   * @returns Validation result.
   */
  export function validateEnum(value: string, allowedValues: string[]): string | true {
    return allowedValues.includes(value) ? true : `Value must be one of: ${allowedValues.join(", ")}.`;
  }
  