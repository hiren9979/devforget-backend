const { Responses } = require('../../utils/responses');
const { executeQuery } = require('../../config/db');

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
    const processedFields = fields.map(field => ({
      ...field,
      validations: field.validations ? JSON.parse(field.validations) : []
    }));

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
    
    const query = `INSERT INTO formconfigs (id, menuId, workspaceId, name, tableName) VALUES (UUID(), ?, ?, ?, ?)`;
    const result = await executeQuery(query, [menuId, workspaceId, name, tableName]);

    if (result.affectedRows != 1) {
      return Responses.badRequest;
    }
    
    return Responses.success;
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

module.exports = {
  getAllFormConfigsDB,
  getFormConfigByIdDB,
  getFormConfigByMenuIdDB,
  getFormConfigWithFieldsDB,
  createFormConfigDB,
  updateFormConfigByIdDB,
  deleteFormConfigByIdDB,
  publishFormConfigDB,
};
