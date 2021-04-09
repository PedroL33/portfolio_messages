const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split("")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  }catch {
    res.status(500).json({
      msg: "Authentication Failed"
    })
  }
}

module.exports = {
  checkAuth
}