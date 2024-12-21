const { body, validationResult } = require('express-validator');
const connection = require('../mysql/mysql');

const addDrone = [
  // Validate and sanitize input fields
  body('part_name').notEmpty().withMessage('Part name is required.'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer.'),
  body('date_of_manufacture').isDate().withMessage('Date of manufacture must be a valid date.'),
  body('Price').isInt({ min: 1 }).withMessage('price must be a positive integer.'),

  // Handle request
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { part_name, quantity, date_of_manufacture,Price } = req.body;

    // Checking  whether the the drone part is  already exists or not
    const checkQuery = 'SELECT * FROM drone_parts WHERE part_name = ? ';
    const checkValues = [part_name];

    connection.query(checkQuery, checkValues, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Drone part is already exists' });
      }

      // Insert new drone part if not exists
      const insertQuery = 'INSERT INTO drone_parts (part_name, quantity, date_of_manufacture,Price) VALUES (?, ?, ?,?)';
      const insertValues = [part_name, quantity, date_of_manufacture,Price];

      connection.query(insertQuery, insertValues, (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(201).json({ message: 'drone part added successfully', part_id: results.insertId });
      });
    });
  }
];

module.exports = addDrone;
