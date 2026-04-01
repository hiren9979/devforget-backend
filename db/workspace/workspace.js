const { Responses } = require('../../utils/responses');
const { executeQuery } = require('../../config/db');

// GET ALL
const getAllWorkspaceDB = async () => {
  try {
    const query = "SELECT * FROM workspace WHERE isDeleted = 0";
    const data = await executeQuery(query);
    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// GET BY ID
const getWorkspaceByIdDB = async (id) => {
  try {
    const query = "SELECT * FROM workspace WHERE id = ? AND isDeleted = 0";
    const data = await executeQuery(query, [id]);

    if (!data || data.length === 0) {
      return [];
    }

    return data[0];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// CREATE
const createWorkspaceDB = async (data) => {
  try {
    
    const query = `INSERT INTO workspace (id, name, email, phone, logoUrl, address) VALUES (UUID(), ?, ?, ?, ?, ?)`;
    const result = await executeQuery(query, [data.name, data.email, data.phone, data.logoUrl, data.address]);

    if (result.affectedRows != 1) {
      return Responses.badRequest;
    }

    return Responses.success;
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// UPDATE BY ID
const updateWorkspaceByIdDB = async (id, payload) => {
  try {
    const setClause = Object.keys(payload).map(key => `${key} = ?`).join(', ');
    const values = Object.values(payload);
    
    const query = `UPDATE workspace SET ${setClause} WHERE id = ? AND isDeleted = 0`;
    const result = await executeQuery(query, [...values, id]);

    if (result.affectedRows === 0) {
      return Responses.notFound;
    }

    return Responses.success;
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// DELETE BY ID
const deleteWorkspaceByIdDB = async (id) => {
  try {
    const query = "UPDATE workspace SET isDeleted = 1 WHERE id = ? AND isDeleted = 0";
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

module.exports = {
  getAllWorkspaceDB,
  getWorkspaceByIdDB,
  createWorkspaceDB,
  updateWorkspaceByIdDB,
  deleteWorkspaceByIdDB,
};
