const {
  getAllFormConfigsDB,
  getFormConfigByIdDB,
  getFormConfigByMenuIdDB,
  getFormConfigWithFieldsDB,
  createFormConfigDB,
  createFormConfigWithFieldsDB,
  updateFormConfigByIdDB,
  deleteFormConfigByIdDB,
  publishFormConfigDB
} = require('../../db/formconfigs/formconfigs');

const {
  createFormFieldDB,
  updateFormFieldByIdDB,
  deleteFormFieldByIdDB,
  reorderFormFieldsDB,
  getFormFieldByIdDB
} = require('../../db/formfields/formfields');

const {
  createFieldValidationDB,
  updateFieldValidationByIdDB,
  deleteFieldValidationByIdDB
} = require('../../db/fieldvalidations/fieldvalidations');

const { sendResponse } = require('../../utils/sendResponse');

// POST /api/forms - Create form config for a menu (admin)
const createFormConfig = async (req, res) => {
  try {
    const workspaceId = req.headers.workspaceid;
    
    if (!workspaceId) {
      return sendResponse(req, res, 400, "Workspace ID is required");
    }
    
    const { menuId, name, tableName, fields } = req.body;
    
    // Validate required fields
    if (!menuId || !name || !tableName) {
      return sendResponse(req, res, 400, "menuId, name, and tableName are required");
    }
    
    const data = {
      menuId,
      workspaceId,
      name,
      tableName,
      fields: fields || [] // Default to empty array if not provided
    };

    let response;
    
    // Use the appropriate function based on whether fields are provided
    if (fields && fields.length > 0) {
      response = await createFormConfigWithFieldsDB(data);
    } else {
      response = await createFormConfigDB(data);
    }
    
    // Check if response is an error object
    if (response && response.statusCode) {
      return sendResponse(req, res, response.statusCode, response.clientMessage);
    }
    
    // Return the created form config (with fields if provided)
    return sendResponse(req, res, 201, response);
  } catch (error) {
    console.error('Error in createFormConfig:', error);
    return sendResponse(req, res, 500, "Failed to create form config");
  }
};

// GET /api/forms/:id - Get form config with all fields (auth)
const getFormConfigWithFields = async (req, res) => {
  try {
    const { id } = req.params;
    const workspaceId = req.headers.workspaceid;
    
    if (!workspaceId) {
      return sendResponse(req, res, 400, "Workspace ID is required");
    }
    
    const data = await getFormConfigWithFieldsDB(workspaceId, id);

    if (!data) {
      return sendResponse(req, res, 404, "Form config not found");
    }

    return sendResponse(req, res, 200, data);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to fetch form config");
  }
};

// GET /api/forms/menu/:menuId - Get form config by menuId with all fields (auth)
const getFormConfigByMenuId = async (req, res) => {
  try {
    const { menuId } = req.params;
    const workspaceId = req.headers.workspaceid;
    
    if (!workspaceId) {
      return sendResponse(req, res, 400, "Workspace ID is required");
    }
    
    // First get the form config by menuId
    const formConfig = await getFormConfigByMenuIdDB(workspaceId, menuId);

    if (!formConfig) {
      return sendResponse(req, res, 404, "Form config not found");
    }

    // Then get the complete form config with all fields
    const data = await getFormConfigWithFieldsDB(workspaceId, formConfig.id);

    if (!data) {
      return sendResponse(req, res, 404, "Form config not found");
    }

    return sendResponse(req, res, 200, data);
  } catch (error) {
    console.error('Error in getFormConfigByMenuId:', error);
    return sendResponse(req, res, 500, "Failed to fetch form config");
  }
};

// PATCH /api/forms/:id - Update form config meta (admin)
const updateFormConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const workspaceId = req.headers.workspaceid;
    
    if (!workspaceId) {
      return sendResponse(req, res, 400, "Workspace ID is required");
    }
    
    const payload = {
      name: req.body.name,
      tableName: req.body.tableName
    };

    const response = await updateFormConfigByIdDB(workspaceId, id, payload);
    return sendResponse(req, res, 200, response);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to update form config");
  }
};

// DELETE /api/forms/:id - Soft-delete form config (admin)
const deleteFormConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const workspaceId = req.headers.workspaceid;
    
    if (!workspaceId) {
      return sendResponse(req, res, 400, "Workspace ID is required");
    }
    
    const response = await deleteFormConfigByIdDB(workspaceId, id);
    return sendResponse(req, res, 200, response);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to delete form config");
  }
};

// POST /api/forms/:id/publish - Publish form — triggers table creation (admin)
const publishFormConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const workspaceId = req.headers.workspaceid;
    
    if (!workspaceId) {
      return sendResponse(req, res, 400, "Workspace ID is required");
    }
    
    const response = await publishFormConfigDB(workspaceId, id);
    return sendResponse(req, res, 200, response);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to publish form config");
  }
};

// POST /api/forms/:id/fields - Add field to form (admin)
const addFormField = async (req, res) => {
  try {
    const { id } = req.params;
    const workspaceId = req.headers.workspaceid;
    
    if (!workspaceId) {
      return sendResponse(req, res, 400, "Workspace ID is required");
    }
    
    const data = {
      formConfigId: id,
      workspaceId: workspaceId,
      fieldName: req.body.fieldName,
      fieldLabel: req.body.fieldLabel,
      fieldType: req.body.fieldType || 'text',
      options: req.body.options || null,
      isRequired: req.body.isRequired || 0,
      isUnique: req.body.isUnique || 0,
      sortOrder: req.body.sortOrder || 0
    };

    const response = await createFormFieldDB(data);
    return sendResponse(req, res, response.status, response);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to add field to form");
  }
};

// PATCH /api/forms/:id/fields/:fieldId - Update field definition (admin)
const updateFormField = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const workspaceId = req.headers.workspaceid;
    
    if (!workspaceId) {
      return sendResponse(req, res, 400, "Workspace ID is required");
    }
    
    const payload = {
      fieldName: req.body.fieldName,
      fieldLabel: req.body.fieldLabel,
      fieldType: req.body.fieldType || 'text',
      options: req.body.options || null,
      isRequired: req.body.isRequired || 0,
      isUnique: req.body.isUnique || 0
    };

    const response = await updateFormFieldByIdDB(workspaceId, fieldId, payload);
    return sendResponse(req, res, 200, response);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to update field");
  }
};

// DELETE /api/forms/:id/fields/:fieldId - Soft-delete field (admin)
const deleteFormField = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const workspaceId = req.headers.workspaceid;
    
    if (!workspaceId) {
      return sendResponse(req, res, 400, "Workspace ID is required");
    }
    
    const response = await deleteFormFieldByIdDB(workspaceId, fieldId);
    return sendResponse(req, res, 200, response);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to delete field");
  }
};

// PATCH /api/forms/:id/fields/reorder - Bulk update field sortOrder (admin)
const reorderFormFields = async (req, res) => {
  try {
    const { id } = req.params;
    const workspaceId = req.headers.workspaceid;
    
    if (!workspaceId) {
      return sendResponse(req, res, 400, "Workspace ID is required");
    }
    
    const { fieldOrders } = req.body; // Array of { id, sortOrder }

    const response = await reorderFormFieldsDB(workspaceId, id, fieldOrders);
    return sendResponse(req, res, 200, response);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to reorder fields");
  }
};

// POST /api/forms/fields/:fieldId/validations - Add validation rule to field (admin)
const addFieldValidation = async (req, res) => {
  try {
    const { fieldId } = req.params;
    
    // Verify field exists
    const field = await getFormFieldByIdDB(req.headers.workspaceid, fieldId);
    if (!field) {
      return sendResponse(req, res, 404, "Field not found");
    }
    
    const data = {
      formFieldId: fieldId,
      validationType: req.body.validationType,
      value: req.body.value || null,
      errorMessage: req.body.errorMessage
    };

    const response = await createFieldValidationDB(data);
    return sendResponse(req, res, response.status, response);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to add validation rule");
  }
};

// PATCH /api/forms/fields/validations/:id - Update validation rule (admin)
const updateFieldValidation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payload = {
      validationType: req.body.validationType,
      value: req.body.value || null,
      errorMessage: req.body.errorMessage
    };

    const response = await updateFieldValidationByIdDB(id, payload);
    return sendResponse(req, res, 200, response);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to update validation rule");
  }
};

// DELETE /api/forms/fields/validations/:id - Delete validation rule (admin)
const deleteFieldValidation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await deleteFieldValidationByIdDB(id);
    return sendResponse(req, res, 200, response);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to delete validation rule");
  }
};

module.exports = {
  createFormConfig,
  getFormConfigWithFields,
  getFormConfigByMenuId,
  updateFormConfig,
  deleteFormConfig,
  publishFormConfig,
  addFormField,
  updateFormField,
  deleteFormField,
  reorderFormFields,
  addFieldValidation,
  updateFieldValidation,
  deleteFieldValidation
};
