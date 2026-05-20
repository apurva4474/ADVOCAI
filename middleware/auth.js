const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        error: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      "SECRET_KEY"
    );

    req.userId = decoded.userId;

    next();

  } catch (error) {

    return res.status(401).json({
      error: "Invalid token",
    });
  }
};

module.exports = authMiddleware;