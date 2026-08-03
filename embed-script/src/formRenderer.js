/**
 * FlowForm DOM Renderer
 */
(function(window) {
  function renderForm(container, formSchema, options = {}) {
    const { fields = [], settings = {} } = formSchema;
    const { apiUrl = 'http://localhost:5000' } = options;

    container.innerHTML = '';

    const formWrapper = document.createElement('div');
    formWrapper.className = 'flowform-container';
    formWrapper.style.cssText = `
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 24px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      color: #1e293b;
      box-sizing: border-box;
    `;

    const formEl = document.createElement('form');
    formEl.className = 'flowform-element';

    // Status Message Box
    const statusBox = document.createElement('div');
    statusBox.className = 'flowform-status';
    statusBox.style.cssText = 'display: none; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 14px; font-weight: 500;';

    // Render Fields
    fields.forEach(field => {
      const fieldGroup = document.createElement('div');
      fieldGroup.style.cssText = 'margin-bottom: 18px; text-align: left;';

      // Label
      const label = document.createElement('label');
      label.style.cssText = 'display: block; font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 6px;';
      label.textContent = field.label || 'Unlabeled Field';
      if (field.required) {
        const reqSpan = document.createElement('span');
        reqSpan.style.cssText = 'color: #ef4444; margin-left: 4px;';
        reqSpan.textContent = '*';
        label.appendChild(reqSpan);
      }
      fieldGroup.appendChild(label);

      let inputEl;

      const baseInputStyle = `
        width: 100%;
        padding: 10px 14px;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        font-size: 14px;
        color: #1e293b;
        background-color: #f8fafc;
        box-sizing: border-box;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
        outline: none;
      `;

      if (field.type === 'textarea') {
        inputEl = document.createElement('textarea');
        inputEl.rows = 4;
        inputEl.style.cssText = baseInputStyle + ' resize: vertical;';
        inputEl.placeholder = field.placeholder || '';
      } else if (field.type === 'dropdown') {
        inputEl = document.createElement('select');
        inputEl.style.cssText = baseInputStyle;
        
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = field.placeholder || '-- Select Option --';
        inputEl.appendChild(defaultOpt);

        const optionsList = Array.isArray(field.options) ? field.options : (field.options ? field.options.split(',') : []);
        optionsList.forEach(opt => {
          const val = typeof opt === 'string' ? opt.trim() : opt;
          if (val) {
            const optEl = document.createElement('option');
            optEl.value = val;
            optEl.textContent = val;
            inputEl.appendChild(optEl);
          }
        });
      } else if (field.type === 'checkbox') {
        const checkContainer = document.createElement('div');
        checkContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px; margin-top: 4px;';

        const optionsList = Array.isArray(field.options) && field.options.length > 0
          ? field.options 
          : [field.placeholder || field.label];

        optionsList.forEach(opt => {
          const val = typeof opt === 'string' ? opt.trim() : opt;
          const lbl = document.createElement('label');
          lbl.style.cssText = 'display: inline-flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; color: #334155;';

          const chk = document.createElement('input');
          chk.type = 'checkbox';
          chk.name = field.id;
          chk.value = val;
          chk.style.cssText = 'width: 16px; height: 16px; accent-color: #4f46e5; cursor: pointer;';

          lbl.appendChild(chk);
          lbl.appendChild(document.createTextNode(val));
          checkContainer.appendChild(lbl);
        });

        fieldGroup.appendChild(checkContainer);
      } else if (field.type === 'radio') {
        const radioContainer = document.createElement('div');
        radioContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px; margin-top: 4px;';

        const optionsList = Array.isArray(field.options) ? field.options : (field.options ? field.options.split(',') : ['Option 1', 'Option 2']);

        optionsList.forEach(opt => {
          const val = typeof opt === 'string' ? opt.trim() : opt;
          const lbl = document.createElement('label');
          lbl.style.cssText = 'display: inline-flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; color: #334155;';

          const rad = document.createElement('input');
          rad.type = 'radio';
          rad.name = field.id;
          rad.value = val;
          rad.style.cssText = 'width: 16px; height: 16px; accent-color: #4f46e5; cursor: pointer;';

          lbl.appendChild(rad);
          lbl.appendChild(document.createTextNode(val));
          radioContainer.appendChild(lbl);
        });

        fieldGroup.appendChild(radioContainer);
      } else {
        // text, email, phone
        inputEl = document.createElement('input');
        inputEl.type = field.type === 'phone' ? 'tel' : (field.type || 'text');
        inputEl.placeholder = field.placeholder || '';
        inputEl.style.cssText = baseInputStyle;
      }

      if (inputEl) {
        inputEl.name = field.id;
        inputEl.id = `ff_${field.id}`;
        
        inputEl.addEventListener('focus', () => {
          inputEl.style.borderColor = '#4f46e5';
          inputEl.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.15)';
        });
        inputEl.addEventListener('blur', () => {
          inputEl.style.borderColor = '#cbd5e1';
          inputEl.style.boxShadow = 'none';
        });

        fieldGroup.appendChild(inputEl);
      }

      // Error message container for field
      const errEl = document.createElement('div');
      errEl.className = `ff-err-${field.id}`;
      errEl.style.cssText = 'color: #ef4444; font-size: 12px; margin-top: 4px; display: none;';
      fieldGroup.appendChild(errEl);

      formEl.appendChild(fieldGroup);
    });

    // Submit Button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = settings.submitButtonText || 'Submit';
    submitBtn.style.cssText = `
      width: 100%;
      padding: 12px 20px;
      background-color: #4f46e5;
      color: #ffffff;
      font-size: 15px;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
      margin-top: 8px;
    `;
    submitBtn.addEventListener('mouseenter', () => submitBtn.style.backgroundColor = '#4338ca');
    submitBtn.addEventListener('mouseleave', () => submitBtn.style.backgroundColor = '#4f46e5');

    formEl.appendChild(submitBtn);

    // Form Submission Handling
    formEl.addEventListener('submit', async (e) => {
      e.preventDefault();
      statusBox.style.display = 'none';

      // Collect payload
      const payload = {};
      let hasValidationError = false;

      fields.forEach(field => {
        const errContainer = formEl.querySelector(`.ff-err-${field.id}`);
        if (errContainer) errContainer.style.display = 'none';

        let val = '';
        if (field.type === 'checkbox') {
          const checked = Array.from(formEl.querySelectorAll(`input[name="${field.id}"]:checked`)).map(c => c.value);
          val = checked.join(', ');
        } else if (field.type === 'radio') {
          const checked = formEl.querySelector(`input[name="${field.id}"]:checked`);
          val = checked ? checked.value : '';
        } else {
          const el = formEl.querySelector(`[name="${field.id}"]`);
          val = el ? el.value : '';
        }

        // Validate
        if (window.FlowFormValidator) {
          const fieldErrs = window.FlowFormValidator.validateField(field, val);
          if (fieldErrs.length > 0) {
            hasValidationError = true;
            if (errContainer) {
              errContainer.textContent = fieldErrs[0];
              errContainer.style.display = 'block';
            }
          }
        }

        payload[field.label || field.id] = val;
      });

      if (hasValidationError) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      try {
        if (window.FlowFormSubmitter) {
          const result = await window.FlowFormSubmitter.submitFormData(apiUrl, formSchema.id, payload);
          
          statusBox.style.display = 'block';
          statusBox.style.backgroundColor = '#dcfce7';
          statusBox.style.color = '#15803d';
          statusBox.style.border = '1px solid #bbf7d0';
          statusBox.textContent = result.message || settings.successMessage || 'Submission successful!';

          formEl.reset();
        }
      } catch (err) {
        statusBox.style.display = 'block';
        statusBox.style.backgroundColor = '#fee2e2';
        statusBox.style.color = '#b91c1c';
        statusBox.style.border = '1px solid #fecaca';
        statusBox.textContent = err.message || 'Failed to submit form. Please try again.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = settings.submitButtonText || 'Submit';
      }
    });

    formWrapper.appendChild(statusBox);
    formWrapper.appendChild(formEl);
    container.appendChild(formWrapper);
  }

  window.FlowFormRenderer = {
    renderForm
  };
})(window);
