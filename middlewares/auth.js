const TOKEN_SECRET = process.env.TOKEN_SECRET;
// Import package jsonwebtoken
const jwt = require("jsonwebtoken");

// Récupération et vérification du token stockage userId dans la requête pour les routes
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, TOKEN_SECRET);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
