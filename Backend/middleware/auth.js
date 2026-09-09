const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret_wedding_key_2026");
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Token invalid or expired" });
  }
};

module.exports = verifyToken;
