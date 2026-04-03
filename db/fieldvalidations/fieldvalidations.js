const { Responses } = require('../../utils/responses');
const { executeQuery } = require('../../config/db');

// CREATE FIELD VALIDATION
const createFieldValidationDB = async (data) => {
  try {
    const { formFieldId, validationType, value, errorMessage } = data;
    
    const query = `INSERT INTO fieldvalidations (id, formFieldId, validationType, value, errorMessage) VALUES (UUID(), ?, ?, ?, ?)`;
    const result = await executeQuery(query, [formFieldId, validationType, value, errorMessage]);

    if (result.affectedRows != 1) {
      return Responses.badRequest;
    }
    
    return Responses.success;
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// UPDATE FIELD VALIDATION
const updateFieldValidationByIdDB = async (id, data) => {
  try {
    const { validationType, value, errorMessage } = data;
    
    const query = `UPDATE fieldvalidations SET validationType = ?, value = ?, errorMessage = ? WHERE id = ?`;
    const result = await executeQuery(query, [validationType, value, errorMessage, id]);

    if (result.affectedRows === 0) {
      return Responses.notFound;
    }

    // Return the updated validation data
    const updatedValidation = await executeQuery("SELECT * FROM fieldvalidations WHERE id = ?", [id]);
    return updatedValidation[0];
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// DELETE FIELD VALIDATION
const deleteFieldValidationByIdDB = async (id) => {
  try {
    const query = "UPDATE fieldvalidations SET isDeleted = 1 WHERE id = ? AND isDeleted = 0";
    const result = await executeQuery(query, [id]);

    if (result.affectedRows === 0) {
      return Responses.notFound;
    }

    return Responses.success;
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// GET FIELD VALIDATION BY ID
const getFieldValidationByIdDB = async (id) => {
  try {
    const query = "SELECT * FROM fieldvalidations WHERE id = ? AND isDeleted = 0";
    const data = await executeQuery(query, [id]);

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
  createFieldValidationDB,
  updateFieldValidationByIdDB,
  deleteFieldValidationByIdDB,
  getFieldValidationByIdDB,
};
