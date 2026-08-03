const emailService = require('./emailService');
const FormModel = require('../models/Form');
const UserModel = require('../models/User');

class NotificationService {
  /**
   * Process and send submission notifications to form owner or designated notification email
   * @param {Object} submission 
   */
  static async notifyNewSubmission(submission) {
    try {
      const form = await FormModel.findById(submission.formId);
      if (!form) {
        console.warn(`[NotificationService] Form with ID ${submission.formId} not found for submission ${submission.id}`);
        return;
      }

      let recipientEmail = form.settings?.notificationEmail;

      if (!recipientEmail) {
        const owner = await UserModel.findById(form.userId);
        if (owner) {
          recipientEmail = owner.email;
        }
      }

      if (!recipientEmail) {
        console.warn(`[NotificationService] No recipient email found for form ${form.name}`);
        return;
      }

      await emailService.sendSubmissionNotification({
        to: recipientEmail,
        formName: form.name,
        data: submission.data
      });
    } catch (error) {
      console.error('[NotificationService] Error triggering notification:', error);
    }
  }
}

module.exports = NotificationService;
