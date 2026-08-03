const express = require('express');
const router = express.Router();
const {
  createForm,
  getForms,
  getFormById,
  updateForm,
  deleteForm,
  getPublicFormSchema
} = require('../controllers/formController');
const { protect } = require('../middleware/auth');

// Public embed schema route (no auth required)
router.get('/public/:id', getPublicFormSchema);

// Protected routes
router.use(protect);
router.route('/')
  .post(createForm)
  .get(getForms);

router.route('/:id')
  .get(getFormById)
  .put(updateForm)
  .delete(deleteForm);

module.exports = router;
