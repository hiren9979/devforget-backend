const {
  checkTableExistsDB,
  createTableFromFormConfigDB,
  insertFormDataDB
} = require('../../db/formdata/formData');

const { sendResponse } = require('../../utils/sendResponse');

// GET /api/forms/user/:formConfigId - Get form for user submission by formConfigId
const getFormForSubmission = async (req, res) => {
  try {
    const { formConfigId } = req.params;
    const workspaceId = req.headers.workspaceid;
    
    if (!workspaceId) {
      return sendResponse(req, res, 400, "Workspace ID is required");
    }
    
    // Get complete form config with fields
    const {
      getFormConfigWithFieldsDB
    } = require('../../db/formconfigs/formconfigs');
    
    const completeFormConfig = await getFormConfigWithFieldsDB(workspaceId, formConfigId);
    if (!completeFormConfig) {
      return sendResponse(req, res, 404, "Form configuration not found");
    }

    // Check if form is published
    if (completeFormConfig.status !== 'published') {
      return sendResponse(req, res, 400, "Form is not published yet");
    }

    // Check if data table exists
    const tableExists = await checkTableExistsDB(completeFormConfig.tableName);
    
    const response = {
      form: completeFormConfig,
      tableExists: tableExists
    };

    return sendResponse(req, res, 200, response);
  } catch (error) {
    console.error('Error in getFormForSubmission:', error);
    return sendResponse(req, res, 500, "Failed to get form for submission");
  }
};

// POST /api/forms/user/:formConfigId/submit - Submit form data
const submitFormData = async (req, res) => {
  try {
    const { formConfigId } = req.params;
    const workspaceId = req.headers.workspaceid;
    const formData = req.body;
    
    if (!workspaceId) {
      return sendResponse(req, res, 400, "Workspace ID is required");
    }
    
    // Get complete form config with fields for validation
    const {
      getFormConfigWithFieldsDB
    } = require('../../db/formconfigs/formconfigs');
    
    const completeFormConfig = await getFormConfigWithFieldsDB(workspaceId, formConfigId);
    if (!completeFormConfig) {
      return sendResponse(req, res, 404, "Form configuration not found");
    }

    // Check if table exists, create if not
    const tableExists = await checkTableExistsDB(completeFormConfig.tableName);
    if (!tableExists) {
      console.log(`Table ${completeFormConfig.tableName} does not exist. Creating...`);
      const createResult = await createTableFromFormConfigDB(workspaceId, completeFormConfig.id);
      if (createResult.statusCode) {
        return sendResponse(req, res, createResult.statusCode, createResult.clientMessage);
      }
    }

    // Validate form data against field definitions
    const validationResult = validateFormData(formData, completeFormConfig.fields);
    if (!validationResult.isValid) {
      return sendResponse(req, res, 400, {
        message: "Validation failed",
        errors: validationResult.errors
      });
    }

    // Insert form data
    const insertResult = await insertFormDataDB(completeFormConfig.tableName, validationResult.validatedData, workspaceId);
    
    if (insertResult.statusCode) {
      return sendResponse(req, res, insertResult.statusCode, insertResult.clientMessage);
    }

    return sendResponse(req, res, 201, {
      message: "Form submitted successfully",
      data: insertResult
    });
  } catch (error) {
    console.error('Error in submitFormData:', error);
    return sendResponse(req, res, 500, "Failed to submit form data");
  }
};


// Helper function to validate form data
function validateFormData(formData, fields) {
  const errors = [];
  const validatedData = {};

  for (const field of fields) {
    const { fieldName, fieldLabel, fieldType, isRequired, validations } = field;
    const value = formData[fieldName];

    // Check required fields
    if (isRequired && (value === undefined || value === null || value === '')) {
      errors.push(`${fieldLabel} is required`);
      continue;
    }

    // Skip validation if field is not required and empty
    if (!isRequired && (value === undefined || value === null || value === '')) {
      continue;
    }

    // Type validation
    let validatedValue = value;
    
    switch (fieldType) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push(`${fieldLabel} must be a valid email`);
        }
        break;
      case 'number':
        const numValue = Number(value);
        if (isNaN(numValue)) {
          errors.push(`${fieldLabel} must be a valid number`);
        } else {
          validatedValue = numValue;
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          validatedValue = value === 'true' || value === 1 || value === '1';
        }
        break;
    }

    // Custom validations
    if (validations && validations.length > 0) {
      for (const validation of validations) {
        const { validationType, value: validationValue, errorMessage } = validation;
        
        switch (validationType) {
          case 'minLength':
            if (validatedValue.length < parseInt(validationValue)) {
              errors.push(errorMessage || `${fieldLabel} must be at least ${validationValue} characters`);
            }
            break;
          case 'maxLength':
            if (validatedValue.length > parseInt(validationValue)) {
              errors.push(errorMessage || `${fieldLabel} must not exceed ${validationValue} characters`);
            }
            break;
          case 'min':
            if (Number(validatedValue) < Number(validationValue)) {
              errors.push(errorMessage || `${fieldLabel} must be at least ${validationValue}`);
            }
            break;
          case 'max':
            if (Number(validatedValue) > Number(validationValue)) {
              errors.push(errorMessage || `${fieldLabel} must not exceed ${validationValue}`);
            }
            break;
          case 'regex':
            const regex = new RegExp(validationValue);
            if (!regex.test(validatedValue)) {
              errors.push(errorMessage || `${fieldLabel} format is invalid`);
            }
            break;
        }
      }
    }

    validatedData[fieldName] = validatedValue;
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
    validatedData: validatedData
  };
}

module.exports = {
  getFormForSubmission,
  submitFormData
};
