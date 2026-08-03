/**
 * Format ISO date string into readable date & time
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Generate unique random ID
 */
export const generateId = (prefix = 'field') => {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Supported field type definitions for Form Builder
 */
export const FIELD_TYPES = [
  { type: 'text', label: 'Text Input', icon: 'Type', description: 'Single line text field' },
  { type: 'email', label: 'Email', icon: 'Mail', description: 'Email address with validation' },
  { type: 'phone', label: 'Phone', icon: 'Phone', description: 'Phone number input' },
  { type: 'textarea', label: 'Textarea', icon: 'AlignLeft', description: 'Multi-line message box' },
  { type: 'dropdown', label: 'Dropdown', icon: 'ChevronDown', description: 'Single selection dropdown menu' },
  { type: 'checkbox', label: 'Checkbox', icon: 'CheckSquare', description: 'Multiple check options' },
  { type: 'radio', label: 'Radio Button', icon: 'Disc', description: 'Single radio choice options' }
];

/**
 * Default field creator template
 */
export const createDefaultField = (type) => {
  const id = generateId(type);
  switch (type) {
    case 'text':
      return { id, type, label: 'Full Name', placeholder: 'Enter your full name', required: true };
    case 'email':
      return { id, type, label: 'Email Address', placeholder: 'name@company.com', required: true };
    case 'phone':
      return { id, type, label: 'Phone Number', placeholder: '+1 (555) 000-0000', required: false };
    case 'textarea':
      return { id, type, label: 'Message', placeholder: 'Type your message here...', required: false };
    case 'dropdown':
      return { id, type, label: 'Select Service', placeholder: '-- Choose an Option --', options: ['Web Design', 'SEO Optimization', 'Custom Development'], required: false };
    case 'checkbox':
      return { id, type, label: 'Subscribe to updates', placeholder: 'Yes, send me newsletters', options: ['Yes, send me updates'], required: false };
    case 'radio':
      return { id, type, label: 'Budget Range', options: ['$1,000 - $5,000', '$5,000 - $10,000', '$10,000+'], required: false };
    default:
      return { id, type: 'text', label: 'Custom Input', placeholder: '', required: false };
  }
};

/**
 * Generate Webflow HTML/JS embed code snippet
 */
export const generateEmbedCode = (formId, apiHost = 'http://localhost:5000') => {
  return `<!-- FlowForm Embed Code for Webflow -->
<div data-flowform="${formId}"></div>
<script src="${apiHost}/flowform.js" async></script>`;
};
