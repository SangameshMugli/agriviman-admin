const {body,validationResult, Result}= require('express-validator')
const connection=require('../mysql/mysql')

const addTask = [
  body('acres').isDecimal().withMessage('Acres must be a decimal number').toFloat(),
  body('field_type').isString().withMessage('Field type must be a String').trim().escape(),
  body('assigned_to_pilot_id').isInt().withMessage('Assigned pilot must be an integer'),
  body('assigned_date').isDate({ format: 'YYYY-MM-DD' }).withMessage('Assigned date must be a valid date in YYYY-MM-DD format'),
  body('status').isIn(['Completed', 'Pending', 'Cancelled']).withMessage("Status must be one of 'Completed', 'Pending', 'Cancelled'"),
  body('contact_request_id').isInt().withMessage('Contact request ID must be an integer').toInt(),
  body('service').notEmpty().withMessage('service must be selected'),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { acres, field_type, assigned_to_pilot_id, assigned_date, status, contact_request_id,service } = req.body;

    // Check if the contact_request_id is already assigned to a pilot
    const checkQuery = 'SELECT * FROM drone_services WHERE contact_request_id = ?';
    connection.query(checkQuery, [contact_request_id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      if (results.length > 0) {
        return res.status(400).json({ message: 'Task with this contact request ID is already assigned to a pilot' });
      }

      // Adding new Task
      const insertQuery = 'INSERT INTO drone_services (acres, field_type, assigned_to_pilot_id, assigned_date, status, contact_request_id,service) VALUES (?, ?, ?, ?, ?, ?,?)';
      const insertValues = [acres, field_type, assigned_to_pilot_id, assigned_date, status, contact_request_id,service];

      connection.query(insertQuery, insertValues, (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(201).json({ message: 'Task added successfully', service_id: results.insertId });
      });
    });
  },
];

module.exports = addTask;
