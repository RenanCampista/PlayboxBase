// Funções utilitárias para validação
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateForm = (formData, rules) => {
  const errors = {};
  
  for (const [field, validations] of Object.entries(rules)) {
    for (const validation of validations) {
      const result = validation(formData[field]);
      if (result !== true) {
        errors[field] = result;
        break;
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
