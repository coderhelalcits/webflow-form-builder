import { create } from 'zustand';
import { createDefaultField } from '../utils/helpers';

export const useFormStore = create((set, get) => ({
  formId: null,
  name: 'Untitled Webflow Form',
  fields: [
    createDefaultField('text'),
    createDefaultField('email'),
    createDefaultField('textarea')
  ],
  settings: {
    submitButtonText: 'Submit Request',
    successMessage: 'Thank you! We will get back to you shortly.',
    notificationEmail: ''
  },
  selectedFieldId: null,

  // Setters & Actions
  setFormId: (id) => set({ formId: id }),
  setFormName: (name) => set({ name }),
  setFormState: (formData) => set({
    formId: formData.id,
    name: formData.name || 'Untitled Webflow Form',
    fields: formData.fields || [],
    settings: {
      submitButtonText: 'Submit Request',
      successMessage: 'Thank you! We will get back to you shortly.',
      notificationEmail: '',
      ...(formData.settings || {})
    },
    selectedFieldId: formData.fields && formData.fields.length > 0 ? formData.fields[0].id : null
  }),

  resetForm: () => set({
    formId: null,
    name: 'New Custom Form',
    fields: [
      createDefaultField('text'),
      createDefaultField('email'),
      createDefaultField('textarea')
    ],
    settings: {
      submitButtonText: 'Submit',
      successMessage: 'Thank you! Your response has been recorded.',
      notificationEmail: ''
    },
    selectedFieldId: null
  }),

  addField: (type) => {
    const newField = createDefaultField(type);
    set((state) => ({
      fields: [...state.fields, newField],
      selectedFieldId: newField.id
    }));
  },

  removeField: (id) => {
    set((state) => {
      const newFields = state.fields.filter((f) => f.id !== id);
      const newSelectedId = state.selectedFieldId === id 
        ? (newFields.length > 0 ? newFields[newFields.length - 1].id : null) 
        : state.selectedFieldId;
      return {
        fields: newFields,
        selectedFieldId: newSelectedId
      };
    });
  },

  selectField: (id) => set({ selectedFieldId: id }),

  updateField: (id, updatedProperties) => {
    set((state) => ({
      fields: state.fields.map((f) => (f.id === id ? { ...f, ...updatedProperties } : f))
    }));
  },

  moveField: (startIndex, endIndex) => {
    set((state) => {
      const result = Array.from(state.fields);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { fields: result };
    });
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }));
  }
}));
