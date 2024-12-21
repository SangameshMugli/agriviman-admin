const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");

const authenticateToken = (req, res, next) => {

  console.log("Cookies:", req.cookies); // Debugging: Log cookies
  console.log("Authorization Header:", req.headers["authorization"]); // Debugging: Log Authorization header

  // Try to get the token from cookies
  let token = req.cookies.token;

  // If the token is not in cookies, try to get it from the Authorization header
  if (!token) {
    const authHeader = req.headers["authorization"];
    token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  }

  // If the token is still not found, handle the error
  if (!token) {
    res.status(401);
    const response = {
      message: "Token is required. Please provide a token.",
    };
    res.set({
      "Content-Type": "application/json",
    });
    return res.send(response);
  }

  // Verify the JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        res.status(401);
        const response = {
          message: "Token has expired.",
        };
        res.set({
          "Content-Type": "application/json",
        });
        return res.send(response);
      } else {
        res.status(401);
        const response = {
          message: "Token is invalid.",
        };
        res.set({
          "Content-Type": "application/json",
        });
        return res.send(response);
      }
    } else {
      // If the token is valid, store the decoded information in res.locals
      res.locals.admin = decoded;
      next();
    }
  });
};

module.exports = authenticateToken;
