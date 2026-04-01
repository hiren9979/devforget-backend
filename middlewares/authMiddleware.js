const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.PRIVATE_KEY;

const authMiddleware = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  if (!SECRET_KEY) {
    throw new Error("PRIVATE_KEY environment variable is not defined");
  }

  jwt.verify(authToken.split(" ")[1], SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded;
    req.role = {
      id: decoded.roleId,
      name: decoded.role
    };
    next();
  });
};

module.exports = {
  authMiddleware,
};
