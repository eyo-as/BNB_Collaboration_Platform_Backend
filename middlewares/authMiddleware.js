// import the jsonwebtoken module
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
}

// Middleware to check roles
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied. Insufficient permissions." });
    }
    next();
  };
}

// export the verifyToken function
module.exports = { verifyToken, authorizeRole };
