const {
  getAllMenusDB,
  getMenusByIdDB,
  createMenusDB,
  updateMenusByIdDB,
  deleteMenusByIdDB
} = require('../../db/menus/menus');

const { sendResponse } = require('../../utils/sendResponse');

// GET /api/menus
const getAllMenusData = async (req, res) => {
  try {
    const workspaceId = req.body.workspaceId;
    
    if (!workspaceId) {
      return sendResponse(req, res, 400, "Workspace ID is required");
    }
    
    const data = await getAllMenusDB(workspaceId);
    return sendResponse(req, res, 200, data);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to fetch data");
  }
};

// GET /api/menus/:id
const getMenusDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const workspaceId = req.body.workspaceId;
    
    if (!workspaceId) {
      return sendResponse(req, res, 400, "Workspace ID is required");
    }
    
    const data = await getMenusByIdDB(workspaceId, id);

    if (!data) {
      return sendResponse(req, res, 404, "Data not found");
    }

    return sendResponse(req, res, 200, data);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to fetch data by ID");
  }
};

// POST /api/menus
const createMenusData = async (req, res) => {
  try {
    const workspaceId = req.body.workspaceId;
    
    if (!workspaceId) {
      return sendResponse(req, res, 400, "Workspace ID is required");
    }
    
    const data = {
      name : req.body.name,
      tableName: req.body.tableName,
      workspaceId: workspaceId,
      icon: req.body.icon || null,
      parentId: req.body.parentId || null,
      sortOrder: req.body.sortOrder || 0
    }

    const response = await createMenusDB(data);
    return sendResponse(req, res, 201, response);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to create data");
  }
};

// PUT /api/menus/:id
const updateMenusDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const workspaceId = req.body.workspaceId;
    
    if (!workspaceId) {
      return sendResponse(req, res, 400, "Workspace ID is required");
    }
    
    const payload = req.body;
    const response = await updateMenusByIdDB(workspaceId, id, payload);
    return sendResponse(req, res, 200, response);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to update data");
  }
};

// DELETE /api/menus/:id
const deleteMenusDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const workspaceId = req.body.workspaceId;
    
    if (!workspaceId) {
      return sendResponse(req, res, 400, "Workspace ID is required");
    }
    
    const response = await deleteMenusByIdDB(workspaceId, id);
    return sendResponse(req, res, 200, response);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to delete data");
  }
};

module.exports = {
  getAllMenusData,
  getMenusDataById,
  createMenusData,
  updateMenusDataById,
  deleteMenusDataById
};
