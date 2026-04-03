const { Responses } = require('../../utils/responses');
const { executeQuery } = require('../../config/db');

// CREATE FORM FIELD
const createFormFieldDB = async (data) => {
  try {
    const { formConfigId, workspaceId, fieldName, fieldLabel, fieldType, options, isRequired, isUnique, sortOrder } = data;
    
    const query = `INSERT INTO formfields (id, formConfigId, workspaceId, fieldName, fieldLabel, fieldType, options, isRequired, isUnique, sortOrder) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const result = await executeQuery(query, [
      formConfigId, 
      workspaceId, 
      fieldName, 
      fieldLabel, 
      fieldType || 'text', 
      options ? JSON.stringify(options) : null, 
      isRequired || 0, 
      isUnique || 0, 
      sortOrder || 0
    ]);

    if (result.affectedRows != 1) {
      return Responses.badRequest;
    }
    
    return Responses.success;
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// UPDATE FORM FIELD
const updateFormFieldByIdDB = async (workspaceId, fieldId, data) => {
  try {
    const { fieldName, fieldLabel, fieldType, options, isRequired, isUnique } = data;
    
    const query = `UPDATE formfields SET fieldName = ?, fieldLabel = ?, fieldType = ?, options = ?, isRequired = ?, isUnique = ? WHERE id = ? AND workspaceId = ? AND isDeleted = 0`;
    const result = await executeQuery(query, [
      fieldName, 
      fieldLabel, 
      fieldType || 'text', 
      options ? JSON.stringify(options) : null, 
      isRequired || 0, 
      isUnique || 0, 
      fieldId, 
      workspaceId
    ]);

    if (result.affectedRows === 0) {
      return Responses.notFound;
    }

    // Return the updated field data
    const updatedField = await executeQuery("SELECT * FROM formfields WHERE id = ?", [fieldId]);
    return updatedField[0];
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// DELETE FORM FIELD (SOFT DELETE)
const deleteFormFieldByIdDB = async (workspaceId, fieldId) => {
  try {
    const query = "UPDATE formfields SET isDeleted = 1 WHERE id = ? AND workspaceId = ? AND isDeleted = 0";
    const result = await executeQuery(query, [fieldId, workspaceId]);

    if (result.affectedRows === 0) {
      return Responses.notFound;
    }

    return Responses.success;
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// REORDER FORM FIELDS
const reorderFormFieldsDB = async (workspaceId, formConfigId, fieldOrders) => {
  try {
    // fieldOrders is an array of { id, sortOrder }
    const promises = fieldOrders.map(({ id, sortOrder }) => {
      const query = `UPDATE formfields SET sortOrder = ? WHERE id = ? AND formConfigId = ? AND workspaceId = ? AND isDeleted = 0`;
      return executeQuery(query, [sortOrder, id, formConfigId, workspaceId]);
    });

    await Promise.all(promises);
    return Responses.success;
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// GET FORM FIELD BY ID
const getFormFieldByIdDB = async (workspaceId, fieldId) => {
  try {
    const query = "SELECT * FROM formfields WHERE id = ? AND workspaceId = ? AND isDeleted = 0";
    const data = await executeQuery(query, [fieldId, workspaceId]);

    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = {
  createFormFieldDB,
  updateFormFieldByIdDB,
  deleteFormFieldByIdDB,
  reorderFormFieldsDB,
  getFormFieldByIdDB,
};
