const express = require('express');
const router = express.Router();
const formsController = require('../../controllers/forms/formsController');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const { adminMiddleware } = require('../../middlewares/adminMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /api/forms - Create form config for a menu (admin)
router.post('/', adminMiddleware, formsController.createFormConfig);

// GET /api/forms/:id - Get form config with all fields (auth)
router.get('/:id', formsController.getFormConfigWithFields);

// GET /api/forms/menu/:menuId - Get form config by menuId (auth)
router.get('/menu/:menuId', formsController.getFormConfigByMenuId);

// PATCH /api/forms/:id - Update form config meta (admin)
router.patch('/:id', adminMiddleware, formsController.updateFormConfig);

// DELETE /api/forms/:id - Soft-delete form config (admin)
router.delete('/:id', adminMiddleware, formsController.deleteFormConfig);

// POST /api/forms/:id/publish - Publish form — triggers table creation (admin)
router.post('/:id/publish', adminMiddleware, formsController.publishFormConfig);

// POST /api/forms/:id/fields - Add field to form (admin)
router.post('/:id/fields', adminMiddleware, formsController.addFormField);

// PATCH /api/forms/:id/fields/:fieldId - Update field definition (admin)
router.patch('/:id/fields/:fieldId', adminMiddleware, formsController.updateFormField);

// DELETE /api/forms/:id/fields/:fieldId - Soft-delete field (admin)
router.delete('/:id/fields/:fieldId', adminMiddleware, formsController.deleteFormField);

// PATCH /api/forms/:id/fields/reorder - Bulk update field sortOrder (admin)
router.patch('/:id/fields/reorder', adminMiddleware, formsController.reorderFormFields);

// POST /api/forms/fields/:fieldId/validations - Add validation rule to field (admin)
router.post('/fields/:fieldId/validations', adminMiddleware, formsController.addFieldValidation);

// PATCH /api/forms/fields/validations/:id - Update validation rule (admin)
router.patch('/fields/validations/:id', adminMiddleware, formsController.updateFieldValidation);

// DELETE /api/forms/fields/validations/:id - Delete validation rule (admin)
router.delete('/fields/validations/:id', adminMiddleware, formsController.deleteFieldValidation);

module.exports = router;
