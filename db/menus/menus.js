const { Responses } = require('../../utils/responses');
const { executeQuery } = require('../../config/db');

// GET ALL
const getAllMenusDB = async (workspaceId) => {
  try {
    const query = "SELECT * FROM menus WHERE workspaceId = ? AND isDeleted = 0 ORDER BY sortOrder ASC";
    const data = await executeQuery(query, [workspaceId]);
    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// GET BY ID
const getMenusByIdDB = async (workspaceId, id) => {
  try {
    const query = "SELECT * FROM menus WHERE id = ? AND workspaceId = ? AND isDeleted = 0";
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

// CREATE
const createMenusDB = async (workspaceId, payload) => {
  try {
    const { name, tableName, icon, parentId, sortOrder } = payload;
    
    const query = `INSERT INTO menus (id, workspaceId, name, tableName, icon, parentId, sortOrder) VALUES (UUID(), ?, ?, ?, ?, ?, ?)`;
    const result = await executeQuery(query, [
      workspaceId, 
      name, 
      tableName, 
      icon || null, 
      parentId || null, 
      sortOrder || 0
    ]);

    if (result.affectedRows != 1) {
      return Responses.badRequest;
    }

    // Return the created menu data
    const createdMenu = await executeQuery("SELECT * FROM menus WHERE id = LAST_INSERT_ID()");
    return createdMenu[0];
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// UPDATE BY ID
const updateMenusByIdDB = async (workspaceId, id, payload) => {
  try {
    const { name, tableName, icon, parentId, sortOrder } = payload;
    
    const query = `UPDATE menus SET name = ?, tableName = ?, icon = ?, parentId = ?, sortOrder = ? WHERE id = ? AND workspaceId = ? AND isDeleted = 0`;
    const result = await executeQuery(query, [
      name, 
      tableName, 
      icon || null, 
      parentId || null, 
      sortOrder || 0, 
      id, 
      workspaceId
    ]);

    if (result.affectedRows === 0) {
      return Responses.notFound;
    }

    // Return the updated menu data
    const updatedMenu = await executeQuery("SELECT * FROM menus WHERE id = ?", [id]);
    return updatedMenu[0];
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// DELETE BY ID
const deleteMenusByIdDB = async (workspaceId, id) => {
  try {
    const query = "UPDATE menus SET isDeleted = 1 WHERE id = ? AND workspaceId = ? AND isDeleted = 0";
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

module.exports = {
  getAllMenusDB,
  getMenusByIdDB,
  createMenusDB,
  updateMenusByIdDB,
  deleteMenusByIdDB,
};
