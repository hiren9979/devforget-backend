const { Responses } = require('../../utils/responses');
const { executeQuery } = require('../../config/db');
const { generateV4Uuid } = require('../../utils/common');

// GET ALL FORM CONFIGS
const getAllFormConfigsDB = async (workspaceId) => {
  try {
    const query = "SELECT * FROM formconfigs WHERE workspaceId = ? AND isDeleted = 0 ORDER BY createdAt DESC";
    const data = await executeQuery(query, [workspaceId]);
    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// GET FORM CONFIG BY ID
const getFormConfigByIdDB = async (workspaceId, id) => {
  try {
    const query = "SELECT * FROM formconfigs WHERE id = ? AND workspaceId = ? AND isDeleted = 0";
    const data = await executeQuery(query, [id, workspaceId]);

    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

// GET FORM CONFIG BY MENU ID
const getFormConfigByMenuIdDB = async (workspaceId, menuId) => {
  try {
    const query = "SELECT * FROM formconfigs WHERE menuId = ? AND workspaceId = ? AND isDeleted = 0";
    const data = await executeQuery(query, [menuId, workspaceId]);

    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

// GET FORM CONFIG WITH ALL FIELDS
const getFormConfigWithFieldsDB = async (workspaceId, id) => {
  try {
    // Get form config
    const formConfigQuery = "SELECT * FROM formconfigs WHERE id = ? AND workspaceId = ? AND isDeleted = 0";
    const formConfig = await executeQuery(formConfigQuery, [id, workspaceId]);

    if (!formConfig || formConfig.length === 0) {
      return null;
    }

    // Get form fields
    const fieldsQuery = `
      SELECT ff.*, 
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'id', fv.id,
                 'validationType', fv.validationType,
                 'value', fv.value,
                 'errorMessage', fv.errorMessage
               )
             ) as validations
      FROM formfields ff
      LEFT JOIN fieldvalidations fv ON ff.id = fv.formFieldId AND fv.isDeleted = 0
      WHERE ff.formConfigId = ? AND ff.workspaceId = ? AND ff.isDeleted = 0
      GROUP BY ff.id
      ORDER BY ff.sortOrder ASC
    `;
    const fields = await executeQuery(fieldsQuery, [id, workspaceId]);

    // Parse validations JSON for each field
    const processedFields = fields.map(field => {
      let validations = [];
      if (field.validations) {
        try {
          // Check if it's already a parsed object/array or a string
          if (typeof field.validations === 'string') {
            validations = JSON.parse(field.validations);
          } else if (Array.isArray(field.validations)) {
            validations = field.validations;
          } else {
            validations = [];
          }
        } catch (error) {
          console.error('Error parsing validations:', error);
          validations = [];
        }
      }
      return {
        ...field,
        validations: validations
      };
    });

    return {
      ...formConfig[0],
      fields: processedFields
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

// CREATE FORM CONFIG
const createFormConfigDB = async (data) => {
  try {
    const { menuId, workspaceId, name, tableName } = data;
    const formConfigId = generateV4Uuid();
    
    const query = `INSERT INTO formconfigs (id, menuId, workspaceId, name, tableName) VALUES (?, ?, ?, ?, ?)`;
    const result = await executeQuery(query, [formConfigId, menuId, workspaceId, name, tableName]);

    if (result.affectedRows != 1) {
      return Responses.badRequest;
    }
    
    // Get the inserted form config
    const insertedQuery = "SELECT * FROM formconfigs WHERE id = ?";
    const insertedData = await executeQuery(insertedQuery, [formConfigId]);
    
    return insertedData[0];
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// UPDATE FORM CONFIG
const updateFormConfigByIdDB = async (workspaceId, id, data) => {
  try {
    const { name, tableName } = data;
    
    const query = `UPDATE formconfigs SET name = ?, tableName = ? WHERE id = ? AND workspaceId = ? AND isDeleted = 0`;
    const result = await executeQuery(query, [name, tableName, id, workspaceId]);

    if (result.affectedRows === 0) {
      return Responses.notFound;
    }

    // Return the updated form config data
    const updatedFormConfig = await executeQuery("SELECT * FROM formconfigs WHERE id = ?", [id]);
    return updatedFormConfig[0];
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// DELETE FORM CONFIG (SOFT DELETE)
const deleteFormConfigByIdDB = async (workspaceId, id) => {
  try {
    const query = "UPDATE formconfigs SET isDeleted = 1 WHERE id = ? AND workspaceId = ? AND isDeleted = 0";
    const result = await executeQuery(query, [id, workspaceId]);

    if (result.affectedRows === 0) {
      return Responses.notFound;
    }

    return Responses.success;
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// PUBLISH FORM CONFIG
const publishFormConfigDB = async (workspaceId, id) => {
  try {
    const query = `UPDATE formconfigs SET status = 'published', publishedAt = NOW(), publishedBy = ? WHERE id = ? AND workspaceId = ? AND isDeleted = 0`;
    const result = await executeQuery(query, [workspaceId, id, workspaceId]);

    if (result.affectedRows === 0) {
      return Responses.notFound;
    }

    return Responses.success;
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// CREATE FORM CONFIG WITH FIELDS (TRANSACTION)
const createFormConfigWithFieldsDB = async (data) => {
  try {
    const { menuId, workspaceId, name, tableName, fields } = data;
    const formConfigId = generateV4Uuid();
    
    // Start transaction
    await executeQuery("START TRANSACTION");
    
    try {
      // Create form config
      const formQuery = `INSERT INTO formconfigs (id, menuId, workspaceId, name, tableName) VALUES (?, ?, ?, ?, ?)`;
      const formResult = await executeQuery(formQuery, [formConfigId, menuId, workspaceId, name, tableName]);

      if (formResult.affectedRows != 1) {
        throw new Error("Failed to create form config");
      }
      
      // Get the inserted form config
      const insertedQuery = "SELECT * FROM formconfigs WHERE id = ?";
      const insertedData = await executeQuery(insertedQuery, [formConfigId]);
      const formConfig = insertedData[0];
      
      // Create fields if provided
      if (fields && fields.length > 0) {
        for (let i = 0; i < fields.length; i++) {
          const field = fields[i];
          const { fieldName, fieldLabel, fieldType, options, isRequired, isUnique, validations } = field;
          
          // Create form field
          const fieldId = generateV4Uuid();
          const fieldQuery = `INSERT INTO formfields (id, formConfigId, workspaceId, fieldName, fieldLabel, fieldType, options, isRequired, isUnique, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          const fieldResult = await executeQuery(fieldQuery, [
            fieldId,
            formConfigId,
            workspaceId,
            fieldName,
            fieldLabel,
            fieldType || 'text',
            options ? JSON.stringify(options) : null,
            isRequired || 0,
            isUnique || 0,
            i // sortOrder based on array index
          ]);

          if (fieldResult.affectedRows != 1) {
            throw new Error(`Failed to create field: ${fieldName}`);
          }
          
          // Get the inserted field
          const insertedFieldQuery = "SELECT * FROM formfields WHERE id = ?";
          const insertedFieldData = await executeQuery(insertedFieldQuery, [fieldId]);
          const fieldData = insertedFieldData[0];
          
          // Create validations if provided
          if (validations && validations.length > 0) {
            for (const validation of validations) {
              const { validationType, value, errorMessage } = validation;
              const validationId = generateV4Uuid();
              
              const validationQuery = `INSERT INTO fieldvalidations (id, formFieldId, validationType, value, errorMessage) VALUES (?, ?, ?, ?, ?)`;
              const validationResult = await executeQuery(validationQuery, [
                validationId,
                fieldData.id,
                validationType,
                value || null,
                errorMessage
              ]);

              if (validationResult.affectedRows != 1) {
                throw new Error(`Failed to create validation for field: ${fieldName}`);
              }
            }
          }
        }
      }
      
      // Commit transaction
      await executeQuery("COMMIT");
      
      // Return the complete form config with fields
      const result = await getFormConfigWithFieldsDB(workspaceId, formConfig.id);
      console.log(result);
      return {...Responses.success, data: result};
      
    } catch (error) {
      // Rollback on error
      await executeQuery("ROLLBACK");
      throw error;
    }
    
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

module.exports = {
  getAllFormConfigsDB,
  getFormConfigByIdDB,
  getFormConfigByMenuIdDB,
  getFormConfigWithFieldsDB,
  createFormConfigDB,
  createFormConfigWithFieldsDB,
  updateFormConfigByIdDB,
  deleteFormConfigByIdDB,
  publishFormConfigDB,
};
