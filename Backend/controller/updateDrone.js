const { body, param, validationResult } = require("express-validator");
const connection = require("../mysql/mysql");

const updateDrone = [
  param("part_id")
    .isInt()
    .withMessage("Drone Part ID must be an integer")
    .toInt(),

  body("part_name")
    .optional()
    .isString()
    .withMessage("Part name must be a string")
    .trim()
    .escape(),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  body("date_of_manufacture")
    .optional()
    .isDate()
    .withMessage("Date of manufacture must be a valid date"),
    body("Price")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Price must be a positive integer"),
  
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { part_name, quantity, date_of_manufacture,Price } = req.body;
    const { part_id } = req.params;

    // Check if the drone part exists
    const checkExistingPartQuery = "SELECT * FROM drone_parts WHERE part_id = ?";
    connection.query(checkExistingPartQuery, [part_id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Drone Part not found" });
      }

      const existingDronePart = results[0];
      const updatedPartName = part_name || existingDronePart.part_name;

      // Check for existing part_name that matches the updated name but with a different ID
      const checkDuplicateQuery =
        "SELECT * FROM drone_parts WHERE part_name = ? AND part_id != ?";
      connection.query(
        checkDuplicateQuery,
        [updatedPartName, part_id],
        (err, results) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Database error", error: err });
          }

          if (results.length > 0) {
            return res
              .status(400)
              .json({ message: "Drone part with this name already exists" });
          }

          // Update the Drone part record
          const updateQuery =
            "UPDATE drone_parts SET part_name = ?, quantity = ?, date_of_manufacture = ?,Price=? WHERE part_id = ?";
          const updateValues = [
            updatedPartName,
            quantity || existingDronePart.quantity,
            date_of_manufacture || existingDronePart.date_of_manufacture,
            Price||existingDronePart.Price,
            part_id,
          ];

          connection.query(updateQuery, updateValues, (err) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Database error", error: err });
            }
            res.status(200).json({ message: "Drone Part updated successfully" });
          });
        }
      );
    });
  },
];

module.exports = updateDrone;
