const SubmissionModel = require('../models/Submission');
const FormModel = require('../models/Form');
const notificationService = require('../services/notificationService');

/**
 * @desc    Submit form data publicly from Webflow embed script
 * @route   POST /api/submissions/public/:formId
 */
const submitFormPublic = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const submissionData = req.body;

    if (!formId) {
      return res.status(400).json({ success: false, message: 'Form ID is required.' });
    }

    const form = await FormModel.findById(formId);
    if (!form) {
      return res.status(404).json({ success: false, message: 'Target form does not exist.' });
    }

    // Required field validation check on server
    if (Array.isArray(form.fields)) {
      for (const field of form.fields) {
        if (field.required && (!submissionData[field.id] && !submissionData[field.label])) {
          return res.status(400).json({
            success: false,
            message: `Field '${field.label || field.id}' is required.`
          });
        }
      }
    }

    const submission = await SubmissionModel.create({
      formId,
      data: submissionData
    });

    // Trigger asynchronous notification email via Resend Service
    notificationService.notifyNewSubmission(submission).catch(err => {
      console.error('[SubmissionController] Asynchronous notification error:', err);
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(201).json({
      success: true,
      message: form.settings?.successMessage || 'Submission received successfully!',
      submissionId: submission.id
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all submissions across all user's forms
 * @route   GET /api/submissions
 */
const getUserSubmissions = async (req, res, next) => {
  try {
    const userForms = await FormModel.findByUserId(req.user.id);
    const formIds = userForms.map(f => f.id);

    const submissions = await SubmissionModel.findByFormIds(formIds);

    res.json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get submissions for a specific form
 * @route   GET /api/submissions/form/:formId
 */
const getFormSubmissions = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const form = await FormModel.findById(formId);

    if (!form || form.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Form not found or unauthorized.' });
    }

    const submissions = await SubmissionModel.findByFormId(formId);

    res.json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard metrics & statistics
 * @route   GET /api/submissions/stats
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const userForms = await FormModel.findByUserId(req.user.id);
    const formIds = userForms.map(f => f.id);

    const totalForms = userForms.length;
    const totalSubmissions = await SubmissionModel.countByFormIds(formIds);
    const recentSubmissions = await SubmissionModel.findByFormIds(formIds);

    res.json({
      success: true,
      stats: {
        totalForms,
        totalSubmissions,
        recentSubmissions: recentSubmissions.slice(0, 5)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitFormPublic,
  getUserSubmissions,
  getFormSubmissions,
  getDashboardStats
};
