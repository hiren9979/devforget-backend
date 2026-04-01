const {
  createUserRole
} = require('../../db/user/user');

const { sendResponse } = require('../../utils/sendResponse');

// POST /api/superAdmin
const createSuperAdmin = async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      role: req.body.role
    }
    const response = await createUserRole(data);
    return sendResponse(req, res, response.statusCode, response.message);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to create super admin");
  }
};

module.exports = {
  createSuperAdmin
};
