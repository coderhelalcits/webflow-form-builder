/**
 * FlowForm Webflow Integration Script
 * Auto-detects <div data-flowform="FORM_ID"></div> containers on Webflow websites.
 */
(function() {
  // Determine API Host from current script tag or default
  let API_URL = 'http://localhost:5000';
  const scriptTags = document.querySelectorAll('script[src*="flowform.js"]');
  if (scriptTags.length > 0) {
    const src = scriptTags[scriptTags.length - 1].src;
    try {
      const urlObj = new URL(src);
      API_URL = urlObj.origin;
    } catch (e) {}
  }

  // --- Inline Validation Module ---
  const Validator = {
    validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    },
    validatePhone(phone) {
      return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(String(phone).trim());
    },
    validateField(field, value) {
      const errors = [];
      if (field.required) {
        if (value === undefined || value === null || String(value).trim() === '') {
          errors.push(`${field.label || 'This field'} is required.`);
          return errors;
        }
      }
      if (!value || String(value).trim() === '') return errors;
      if (field.type === 'email' && !this.validateEmail(value)) {
        errors.push('Please enter a valid email address.');
      }
      if (field.type === 'phone' && !this.validatePhone(value)) {
        errors.push('Please enter a valid phone number.');
      }
      return errors;
    }
  };

  // --- Inline Submitter Module ---
  const Submitter = {
    async submit(formId, payload) {
      const endpoint = `${API_URL}/api/submissions/public/${formId}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit form.');
      }
      return data;
    }
  };

  // --- Inline Renderer Module ---
  function renderFlowForm(container, schema) {
    const { fields = [], settings = {} } = schema;
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 100%;
      margin: 0 auto;
      padding: 24px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      box-sizing: border-box;
    `;

    const statusBox = document.createElement('div');
    statusBox.style.cssText = 'display: none; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 14px; font-weight: 500;';

    const formEl = document.createElement('form');

    fields.forEach(field => {
      const group = document.createElement('div');
      group.style.cssText = 'margin-bottom: 16px; text-align: left;';

      const label = document.createElement('label');
      label.style.cssText = 'display: block; font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 6px;';
      label.textContent = field.label || 'Field';
      if (field.required) {
        const req = document.createElement('span');
        req.style.cssText = 'color: #ef4444; margin-left: 4px;';
        req.textContent = '*';
        label.appendChild(req);
      }
      group.appendChild(label);

      const baseCss = 'width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #0f172a; background-color: #f8fafc; box-sizing: border-box; outline: none; transition: all 0.2s ease;';

      if (field.type === 'textarea') {
        const ta = document.createElement('textarea');
        ta.rows = 4;
        ta.name = field.id;
        ta.placeholder = field.placeholder || '';
        ta.style.cssText = baseCss + ' resize: vertical;';
        group.appendChild(ta);
      } else if (field.type === 'dropdown') {
        const sel = document.createElement('select');
        sel.name = field.id;
        sel.style.cssText = baseCss;
        
        const optDef = document.createElement('option');
        optDef.value = '';
        optDef.textContent = field.placeholder || '-- Select Option --';
        sel.appendChild(optDef);

        const opts = Array.isArray(field.options) ? field.options : (field.options ? field.options.split(',') : []);
        opts.forEach(o => {
          const val = typeof o === 'string' ? o.trim() : o;
          if (val) {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = val;
            sel.appendChild(opt);
          }
        });
        group.appendChild(sel);
      } else if (field.type === 'checkbox') {
        const opts = Array.isArray(field.options) && field.options.length > 0 ? field.options : [field.placeholder || field.label];
        const flex = document.createElement('div');
        flex.style.cssText = 'display: flex; flex-direction: column; gap: 8px; margin-top: 4px;';
        opts.forEach(o => {
          const val = typeof o === 'string' ? o.trim() : o;
          const l = document.createElement('label');
          l.style.cssText = 'display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: #334155; cursor: pointer;';
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.name = field.id;
          input.value = val;
          input.style.cssText = 'width: 16px; height: 16px; accent-color: #4f46e5;';
          l.appendChild(input);
          l.appendChild(document.createTextNode(val));
          flex.appendChild(l);
        });
        group.appendChild(flex);
      } else if (field.type === 'radio') {
        const opts = Array.isArray(field.options) ? field.options : (field.options ? field.options.split(',') : ['Option 1', 'Option 2']);
        const flex = document.createElement('div');
        flex.style.cssText = 'display: flex; flex-direction: column; gap: 8px; margin-top: 4px;';
        opts.forEach(o => {
          const val = typeof o === 'string' ? o.trim() : o;
          const l = document.createElement('label');
          l.style.cssText = 'display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: #334155; cursor: pointer;';
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = field.id;
          input.value = val;
          input.style.cssText = 'width: 16px; height: 16px; accent-color: #4f46e5;';
          l.appendChild(input);
          l.appendChild(document.createTextNode(val));
          flex.appendChild(l);
        });
        group.appendChild(flex);
      } else {
        const inp = document.createElement('input');
        inp.type = field.type === 'phone' ? 'tel' : (field.type || 'text');
        inp.name = field.id;
        inp.placeholder = field.placeholder || '';
        inp.style.cssText = baseCss;
        group.appendChild(inp);
      }

      const err = document.createElement('div');
      err.className = `ff-err-${field.id}`;
      err.style.cssText = 'color: #ef4444; font-size: 12px; margin-top: 4px; display: none;';
      group.appendChild(err);

      formEl.appendChild(group);
    });

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.textContent = settings.submitButtonText || 'Submit';
    btn.style.cssText = 'width: 100%; padding: 12px; background: #4f46e5; color: white; font-size: 15px; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; transition: background 0.2s ease; margin-top: 8px;';
    btn.onmouseenter = () => btn.style.background = '#4338ca';
    btn.onmouseleave = () => btn.style.background = '#4f46e5';

    formEl.appendChild(btn);

    formEl.addEventListener('submit', async (e) => {
      e.preventDefault();
      statusBox.style.display = 'none';

      const payload = {};
      let hasError = false;

      fields.forEach(field => {
        const errDiv = formEl.querySelector(`.ff-err-${field.id}`);
        if (errDiv) errDiv.style.display = 'none';

        let val = '';
        if (field.type === 'checkbox') {
          val = Array.from(formEl.querySelectorAll(`input[name="${field.id}"]:checked`)).map(c => c.value).join(', ');
        } else if (field.type === 'radio') {
          const sel = formEl.querySelector(`input[name="${field.id}"]:checked`);
          val = sel ? sel.value : '';
        } else {
          const input = formEl.querySelector(`[name="${field.id}"]`);
          val = input ? input.value : '';
        }

        const errs = Validator.validateField(field, val);
        if (errs.length > 0) {
          hasError = true;
          if (errDiv) {
            errDiv.textContent = errs[0];
            errDiv.style.display = 'block';
          }
        }
        payload[field.label || field.id] = val;
      });

      if (hasError) return;

      btn.disabled = true;
      btn.textContent = 'Submitting...';

      try {
        const res = await Submitter.submit(schema.id, payload);
        statusBox.style.display = 'block';
        statusBox.style.background = '#dcfce7';
        statusBox.style.color = '#15803d';
        statusBox.style.border = '1px solid #bbf7d0';
        statusBox.textContent = res.message || settings.successMessage || 'Form submitted successfully!';
        formEl.reset();
      } catch (err) {
        statusBox.style.display = 'block';
        statusBox.style.background = '#fee2e2';
        statusBox.style.color = '#b91c1c';
        statusBox.style.border = '1px solid #fecaca';
        statusBox.textContent = err.message || 'Error submitting form. Please try again.';
      } finally {
        btn.disabled = false;
        btn.textContent = settings.submitButtonText || 'Submit';
      }
    });

    wrapper.appendChild(statusBox);
    wrapper.appendChild(formEl);
    container.appendChild(wrapper);
  }

  // --- Auto Initialization ---
  async function initFlowForms() {
    const containers = document.querySelectorAll('[data-flowform]');
    if (!containers || containers.length === 0) return;

    containers.forEach(async (container) => {
      const formId = container.getAttribute('data-flowform');
      if (!formId) return;

      container.innerHTML = '<div style="padding: 16px; text-align: center; color: #64748b; font-family: sans-serif;">Loading FlowForm...</div>';

      try {
        const res = await fetch(`${API_URL}/api/forms/public/${formId}`);
        const schema = await res.json();
        if (schema && schema.success) {
          renderFlowForm(container, schema);
        } else {
          container.innerHTML = `<div style="color: #ef4444; font-family: sans-serif; font-size: 14px;">FlowForm Error: ${schema.message || 'Form not found'}</div>`;
        }
      } catch (e) {
        container.innerHTML = '<div style="color: #ef4444; font-family: sans-serif; font-size: 14px;">Failed to load FlowForm.</div>';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFlowForms);
  } else {
    initFlowForms();
  }
})();
