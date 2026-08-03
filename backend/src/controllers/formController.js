const FormModel = require('../models/Form');

/**
 * @desc    Create a new form
 * @route   POST /api/forms
 */
const createForm = async (req, res, next) => {
  try {
    const { name, fields, settings } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Form name is required.' });
    }

    const form = await FormModel.create({
      userId: req.user.id,
      name,
      fields: fields || [],
      settings: settings || {}
    });

    res.status(201).json({
      success: true,
      message: 'Form created successfully.',
      form
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all forms for authenticated user
 * @route   GET /api/forms
 */
const getForms = async (req, res, next) => {
  try {
    const forms = await FormModel.findByUserId(req.user.id);
    res.json({
      success: true,
      count: forms.length,
      forms
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single form details by ID (Protected)
 * @route   GET /api/forms/:id
 */
const getFormById = async (req, res, next) => {
  try {
    const form = await FormModel.findById(req.params.id);

    if (!form || form.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Form not found.' });
    }

    res.json({
      success: true,
      form
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update form configuration & fields
 * @route   PUT /api/forms/:id
 */
const updateForm = async (req, res, next) => {
  try {
    const { name, fields, settings } = req.body;

    const updatedForm = await FormModel.update(req.params.id, req.user.id, {
      name,
      fields,
      settings
    });

    if (!updatedForm) {
      return res.status(404).json({ success: false, message: 'Form not found or unauthorized.' });
    }

    res.json({
      success: true,
      message: 'Form updated successfully.',
      form: updatedForm
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete form
 * @route   DELETE /api/forms/:id
 */
const deleteForm = async (req, res, next) => {
  try {
    const success = await FormModel.delete(req.params.id, req.user.id);

    if (!success) {
      return res.status(404).json({ success: false, message: 'Form not found or unauthorized.' });
    }

    res.json({
      success: true,
      message: 'Form deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get public form schema for Embed Script (Public API)
 * @route   GET /api/forms/public/:id
 */
const getPublicFormSchema = async (req, res, next) => {
  try {
    const form = await FormModel.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ success: false, message: 'Form not found.' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
      success: true,
      id: form.id,
      name: form.name,
      fields: form.fields,
      settings: form.settings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createForm,
  getForms,
  getFormById,
  updateForm,
  deleteForm,
  getPublicFormSchema
};
