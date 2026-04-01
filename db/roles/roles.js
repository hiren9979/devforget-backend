
const { executeQuery } = require("../../config/db");

async function getRoleIdByName(name) {
    try {
        const query = "SELECT id FROM roles WHERE name = ?";
        const result = await executeQuery(query, [name]);
        return result[0].id;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    getRoleIdByName
};
