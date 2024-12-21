const { body, validationResult } = require('express-validator');
const connection = require("../mysql/mysql");

const addOrder = [
  body('part_id').isInt({ min: 1 }).withMessage("Part Id must be a positive integer"),
  body('quantity').isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
  body('ordered_date').isDate({ format: 'YYYY-MM-DD' }).withMessage('Ordered date must be a valid date in YYYY-MM-DD format'),
  body('status').isIn(['Delivered', 'In Transit', 'Cancelled']).withMessage("Status must be one of the following: Delivered, Cancelled, In Transit"),
  body('request_id').isInt({ min: 1 }).withMessage("Request ID must be a positive integer."),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { part_id, quantity, ordered_date, status, request_id } = req.body;

    // Step 1: Fetch the part details (price and available quantity)
    const fetchPartQuery = 'SELECT quantity, Price FROM drone_parts WHERE part_id = ?';
    connection.query(fetchPartQuery, [part_id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Drone part not found' });
      }

      const part = results[0];
      const availableQuantity = part.quantity;
      const partPrice = part.Price;

      // Step 2: Check if there is enough stock
      if (quantity > availableQuantity) {
        return res.status(400).json({ message: 'Insufficient stock available' });
      }

      // Step 3: Calculate the total price
      const total_price = partPrice * quantity;

      // Step 4: Insert the order into drone_parts_orders
      const insertOrderQuery = "INSERT INTO drone_parts_orders(part_id, quantity, ordered_date, status, request_id, total_price) VALUES (?,?,?,?,?,?)";
      const insertOrderValues = [part_id, quantity, ordered_date, status, request_id, total_price];

      connection.query(insertOrderQuery, insertOrderValues, (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }

        // Step 5: Update the quantity in drone_parts table
        const updateQuantityQuery = "UPDATE drone_parts SET quantity = quantity - ? WHERE part_id = ?";
        connection.query(updateQuantityQuery, [quantity, part_id], (err) => {
          if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
          }

          res.status(201).json({ message: 'Order added successfully', order_id: results.insertId });
        });
      });
    });
  }
];

module.exports = addOrder;
