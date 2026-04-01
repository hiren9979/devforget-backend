const {
  getAllWorkspaceDB,
  getWorkspaceByIdDB,
  createWorkspaceDB,
  updateWorkspaceByIdDB,
  deleteWorkspaceByIdDB
} = require('../../db/workspace/workspace');
const { createUserRole } = require('../../db/user/user');

const { sendResponse } = require('../../utils/sendResponse');

// GET /api/workspace
const getAllWorkspaceData = async (req, res) => {
  try {
    const data = await getAllWorkspaceDB();
    return sendResponse(req, res, 200, data);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to fetch data");
  }
};

// GET /api/workspace/:id
const getWorkspaceDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getWorkspaceByIdDB(id);

    if (!data || data.length === 0) {
      return sendResponse(req, res, 404, "Data not found");
    }

    return sendResponse(req, res, 200, data);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to fetch data by ID");
  }
};

// POST /api/workspace
const createWorkspaceData = async (req, res) => {
  try {
    const { name, email, phone, logoUrl, address, adminEmail, adminName } = req.body;
    
    // Create workspace
    const workspaceData = {
      name,
      email,
      phone: phone || null,
      logoUrl: logoUrl || null,
      address: address || null,
      adminEmail: adminEmail || null,
      adminName: adminName || null
    };
    
    const workspaceResponse = await createWorkspaceDB(workspaceData);
    
    if(workspaceResponse.statusCode === 200) {
      // Create admin user for workspace
      if (adminEmail && adminName) {
        const adminPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4);
        
        const adminUserData = {
          email: adminEmail,
          password: adminPassword,
          name: adminName,
          role: 'admin'
        };
        
        const adminUserResponse = await createUserRole(adminUserData);
        
        if (adminUserResponse.statusCode === 200) {
          // Get created workspace data
          const createdWorkspaces = await getAllWorkspaceDB();
          const newWorkspace = createdWorkspaces.find(w => w.email === email);
          
          const responseData = {
            workspace: newWorkspace,
            adminUser: {
              email: adminEmail,
              password: adminPassword,
              name: adminName
            }
          };
          
          return sendResponse(req, res, 201, responseData);
        } else {
          return sendResponse(req, res, adminUserResponse.statusCode, "Failed to create admin user");
        }
      }
    }
    
    return sendResponse(req, res, workspaceResponse.statusCode, workspaceResponse.message);
  } catch (error) {
    console.error(error);
    return sendResponse(req, res, 500, "Failed to create workspace");
  }
};

// PUT /api/workspace/:id
const updateWorkspaceDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const response = await updateWorkspaceByIdDB(id, payload);
    return sendResponse(req, res, response.statusCode, response.message);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to update data");
  }
};

// DELETE /api/workspace/:id
const deleteWorkspaceDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteWorkspaceByIdDB(id);
    return sendResponse(req, res, response.statusCode, response.message);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to delete data");
  }
};

module.exports = {
  getAllWorkspaceData,
  getWorkspaceDataById,
  createWorkspaceData,
  updateWorkspaceDataById,
  deleteWorkspaceDataById
};
