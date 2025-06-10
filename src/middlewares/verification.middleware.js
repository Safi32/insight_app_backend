const jwt = require("jsonwebtoken");
const { statusCodeTemplate } = require("../utils/api.utils");

const verifyToken = (req, res, next) => {
  const jwtSecret = process.env.JWT_SECRET;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return statusCodeTemplate(res, 401, "Bearer Token missing.");

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    // attaching the user info to the request
    req.user = decoded;
    next();
  } catch (error) {
    return statusCodeTemplate(res, 403, "Invalid or expired token");
  }
};

const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return statusCodeTemplate(res, 403, "Access denied");
    }
    next();
  };
};

module.exports = { verifyToken, verifyRole };
