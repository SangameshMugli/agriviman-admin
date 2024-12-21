const { body, param, validationResult } = require("express-validator");
const connection = require("../mysql/mysql");

const updateOrder = [
  param("order_id").isInt().withMessage("Order ID must be an integer").toInt(),

  body("part_id")
    .optional()
    .isInt()
    .withMessage("Part ID must be an integer")
    .toInt(),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer")
    .toInt(),

  body("ordered_date")
    .optional()
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage("Ordered date must be a valid date in YYYY-MM-DD format"),

  body("status")
    .optional()
    .isIn(["Delivered", "In Transit", "Cancelled"])
    .withMessage('Status must be either "Delivered", "In Transit", or "Cancelled"'),

  body("request_id")
    .optional()
    .isInt()
    .withMessage("Request ID must be an integer")
    .toInt(),

  body("total_price")
    .optional()
    .isInt()
    .withMessage("Total price must be an integer")
    .toInt(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { part_id, quantity, ordered_date, status, request_id, total_price } = req.body;
    const { order_id } = req.params;

    // Check if the order exists
    const checkExistingOrderQuery = "SELECT * FROM drone_parts_orders WHERE order_id = ?";
    connection.query(checkExistingOrderQuery, [order_id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Order not found" });
      }

      const existingOrder = results[0]; 

      // Update the order record
      const updateQuery = `
        UPDATE drone_parts_orders 
        SET part_id = ?, quantity = ?, ordered_date = ?, status = ?, request_id = ?, total_price = ? 
        WHERE order_id = ?
      `;
      const updateValues = [
        part_id !== undefined ? part_id : existingOrder.part_id,
        quantity !== undefined ? quantity : existingOrder.quantity,
        ordered_date !== undefined ? ordered_date : existingOrder.ordered_date,
        status !== undefined ? status : existingOrder.status,
        request_id !== undefined ? request_id : existingOrder.request_id,
        total_price !== undefined ? total_price : existingOrder.total_price,
        order_id,
      ];

      connection.query(updateQuery, updateValues, (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json({ message: "Order updated successfully" });
      });
    });
  },
];

module.exports = updateOrder;
