/**
 * FlowForm Submit Handler
 */
(function(window) {
  async function submitFormData(apiUrl, formId, payload) {
    try {
      const endpoint = `${apiUrl.replace(/\/$/, '')}/api/submissions/public/${formId}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit form.');
      }

      return data;
    } catch (error) {
      console.error('[FlowForm Embed] Submission error:', error);
      throw error;
    }
  }

  window.FlowFormSubmitter = {
    submitFormData
  };
})(window);
