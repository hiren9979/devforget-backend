
const { sendResponse } = require("../../utils/sendResponse");
const { loginDB, signupDB } = require("../../db/auth/auth");

//create login with email and password and jwt token
const signup = async (req, res) => {
    try {
        const data = {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name
        }
        const info = await signupDB(data);
        return sendResponse(req, res, info.statusCode, info.clientMessage);
    } catch (e) {
        console.error(e);
        return sendResponse(req, res, 500, { Message: e.message });
    }
};

//create login with email and password and jwt token
const login = async (req, res) => {
    try {
        const data = {
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        }
        const info = await loginDB(data);
        return sendResponse(req, res, 200, info);
    } catch (e) {
        console.error(e);
        return sendResponse(req, res, 500, { Message: e.message });
    }
};

module.exports = {
    login,
    signup
};
