/**
 * FlowForm Client-Side Field Validator
 */
(function(window) {
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePhone(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(String(phone).trim());
  }

  function validateField(field, value) {
    const errors = [];

    // Required check
    if (field.required) {
      if (value === undefined || value === null || String(value).trim() === '') {
        errors.push(`${field.label || 'This field'} is required.`);
        return errors;
      }
    }

    if (!value || String(value).trim() === '') {
      return errors;
    }

    // Type specific checks
    if (field.type === 'email' && !validateEmail(value)) {
      errors.push('Please enter a valid email address.');
    }

    if (field.type === 'phone' && !validatePhone(value)) {
      errors.push('Please enter a valid phone number.');
    }

    return errors;
  }

  window.FlowFormValidator = {
    validateEmail,
    validatePhone,
    validateField
  };
})(window);
