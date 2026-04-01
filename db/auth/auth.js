const { Responses } = require("../../utils/responses");
const { executeQuery } = require("../../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { getRoleIdByName } = require("../roles/roles");

const signupDB = async (data) => {
    try {
        let { email, password, name, role } = data;
        password = bcrypt.hashSync(password, 10);

        const roleId = await getRoleIdByName(role.toLowerCase());
        if (!roleId) {
            return Responses.roleNotFound;
        }
        const query = "INSERT INTO users (id, email, password, name, roleId) VALUES (UUID(), ?, ?, ?, ?)";
        const result = await executeQuery(query, [email, password, name, roleId]);
        if (result.affectedRows != 1) {
            return Responses.badRequest;
        }
        return Responses.success;
    } catch (error) {
        console.error(error);
        return Responses.tryAgain;
    }
};

const loginDB = async (data) => {
    try {
        const { email, password, role } = data;
        const query = `
            SELECT u.*, r.name as roleName 
            FROM users u 
            LEFT JOIN roles r ON r.name = ? AND r.isDeleted = 0
            WHERE u.email = ? AND u.isDeleted = 0
        `;
        const user = await executeQuery(query, [role.toLowerCase(), email]);
        if (!user || user.length === 0) {
            return Responses.notFound;
        }
        
        const isPasswordValid = await bcrypt.compare(password, user[0].passwordHash);
        if (!isPasswordValid) {
            return Responses.notFound;
        }
        
        // Check if user has the requested role
        if (role && user[0].roleName !== role.toLowerCase()) {
            return Responses.notFound;
        }
        
        const token = jwt.sign({ 
            id: user[0].id, 
            email: user[0].email, 
            name: user[0].name, 
            role: user[0].roleName,
            roleId: user[0].roleId
        }, process.env.JWT_SECRET, { expiresIn: "24h" });
        
        return { ...user[0], token };
    } catch (error) {
        console.error(error);
        return Responses.tryAgain;
    }
};

module.exports = {
    loginDB,
    signupDB
};
