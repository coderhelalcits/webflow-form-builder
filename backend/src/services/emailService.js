const { Resend } = require('resend');
const env = require('../config/env');

let resend;
if (env.RESEND_API_KEY) {
  resend = new Resend(env.RESEND_API_KEY);
}

/**
 * Sends form submission notification email to admin/recipient
 * @param {Object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.formName - Name of submitted form
 * @param {Object} params.data - Form submission key-value object
 */
const sendSubmissionNotification = async ({ to, formName, data }) => {
  const customerName = data.name || data.fullName || data.CustomerName || data.Name || 'N/A';
  const email = data.email || data.Email || 'N/A';
  const message = data.message || data.Message || data.comments || JSON.stringify(data, null, 2);

  const subject = `New Form Submission - ${formName}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #4f46e5; margin-bottom: 16px;">New Form Submission</h2>
      <p style="font-size: 14px; color: #475569;">You received a new submission for your Webflow form <strong>${formName}</strong>.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #1e293b; width: 35%;">Form Name:</td>
          <td style="padding: 8px 0; color: #334155;">${formName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">Customer Name:</td>
          <td style="padding: 8px 0; color: #334155;">${customerName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">Email:</td>
          <td style="padding: 8px 0; color: #334155;"><a href="mailto:${email}" style="color: #4f46e5;">${email}</a></td>
        </tr>
      </table>

      <div style="margin-top: 16px; padding: 12px; background-color: #f8fafc; border-left: 4px solid #4f46e5; border-radius: 4px;">
        <strong style="color: #1e293b; display: block; margin-bottom: 6px;">Message / Data:</strong>
        <p style="margin: 0; color: #334155; white-space: pre-wrap; font-size: 14px;">${message}</p>
      </div>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">Powered by FlowForm Webflow Form Builder SaaS</p>
    </div>
  `;

  const textContent = `New Form Submission\n\nForm Name: ${formName}\nCustomer Name: ${customerName}\nEmail: ${email}\nMessage:\n${message}`;

  if (resend) {
    try {
      const response = await resend.emails.send({
        from: env.EMAIL_FROM,
        to: [to],
        subject: subject,
        html: htmlContent,
        text: textContent
      });
      console.log('[Resend Email Service] Notification sent successfully:', response);
      return response;
    } catch (err) {
      console.error('[Resend Email Service] Failed to send email via API:', err);
    }
  } else {
    console.log('\n========================================');
    console.log('📬 [SIMULATED EMAIL NOTIFICATION]');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${textContent}`);
    console.log('========================================\n');
  }

  return { success: true, simulated: !resend };
};

module.exports = {
  sendSubmissionNotification
};
