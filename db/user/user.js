const { Responses } = require('../../utils/responses');
const { executeQuery } = require('../../config/db');
const bcrypt = require('bcrypt');
const { getRoleIdByName } = require('../roles/roles');

// CREATE
const createUserRole = async (data) => {
  try {
    const { email, password, name, role } = data;
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const roleId = await getRoleIdByName(role.toLowerCase());
    if (!roleId) {
      return Responses.notFound;
    }
    
    // Insert user
    const userQuery = "INSERT INTO users (id, email, roleId, passwordHash, name) VALUES (UUID(), ?, ?, ?, ?)";
    const userResult = await executeQuery(userQuery, [email, roleId, hashedPassword, name]);
    
    if (userResult.affectedRows != 1) {
      return Responses.badRequest;
    }
    
    return Responses.success;
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

module.exports = {
  createUserRole
};
