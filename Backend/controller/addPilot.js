const { body, validationResult } = require('express-validator');
const connection = require('../mysql/mysql');

const addPilot = [
  // Validate and sanitize input fields
  body('pilot_name').isString().withMessage('Pilot name must be a string').trim().escape(),
  body('phone_number').isDecimal().withMessage('Phone number must be a valid number').isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits').toInt(),
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),

  // Handle request
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pilot_name, phone_number, email } = req.body;

    // Checking  whether the the pilot is  already exists or not
    const checkQuery = 'SELECT * FROM pilot WHERE email = ? OR phone_number = ?';
    const checkValues = [email, phone_number];

    connection.query(checkQuery, checkValues, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Pilot with this email or phone number already exists' });
      }

      // Insert new pilot if not exists
      const insertQuery = 'INSERT INTO pilot (pilot_name, phone_number, email) VALUES (?, ?, ?)';
      const insertValues = [pilot_name, phone_number, email];

      connection.query(insertQuery, insertValues, (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(201).json({ message: 'Pilot added successfully', pilot_id: results.insertId });
      });
    });
  }
];

module.exports = addPilot;
