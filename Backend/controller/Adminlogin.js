const jwt = require("jsonwebtoken");
const connection = require("../mysql/mysql");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();
const error_handler = require("../controller/errorHandler");

const AdminLogin = (req, res) => {
  const { email, password } = req.body;

  // Check if JWT_SECRET is set
  if (!process.env.JWT_SECRET) {
    return error_handler( "JWT_SECRET is not defined in environment variables.",req,res, 500);
  }

  connection.query(
    "SELECT * FROM admin WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "Error logging in" });
      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const admin = results[0];

      // Compare password
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Creating JWT payload
      const payload = {
        email: admin.email,
        admin_id: admin.admin_id,
      };

      // Generating JWT token
      const jwt_token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "10h",
      });

      // Set cookie with JWT token
      res.cookie("admin_token", jwt_token, {
        maxAge: 36000000, // 1 hour
        httpOnly: true,
        secure: true,
        domain: "localhost",
        sameSite: "lax",
      });

      // Send response
      res.status(200).json({
        message: "Login successful. Enjoy",
        user_token: jwt_token,
      });
    }
  );
};

module.exports = AdminLogin;
