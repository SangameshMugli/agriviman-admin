const { body, param, validationResult } = require("express-validator");
const connection = require("../mysql/mysql");

const updatePilot = [
 
  param("pilot_id").isInt().withMessage("Pilot ID must be an integer").toInt(),

 
  body("pilot_name")
    .optional()
    .isString()
    .withMessage("Pilot name must be a string")
    .trim()
    .escape(),
  body("phone_number")
    .optional()
    .isDecimal()
    .withMessage("Phone number must be a valid number")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits")
    .toInt(),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pilot_name, phone_number, email } = req.body;
    const { pilot_id } = req.params;

    // Checking if the pilot exists or not
    const checkExistingPilotQuery = "SELECT * FROM pilot WHERE pilot_id = ?";
    connection.query(checkExistingPilotQuery, [pilot_id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Pilot not found" });
      }

      // Check for existing email or phone number that is similar to the updated values
      const existingPilot = results[0];
      const updatedEmail = email || existingPilot.email;
      const updatedPhoneNumber = phone_number || existingPilot.phone_number;

      const checkDuplicateQuery =
        "SELECT * FROM pilot WHERE (email = ? OR phone_number = ?) AND pilot_id != ?";
      connection.query(
        checkDuplicateQuery,
        [updatedEmail, updatedPhoneNumber, pilot_id],
        (err, results) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Database error", error: err });
          }

          if (results.length > 0) {
            return res
              .status(400)
              .json({ message: "Email or phone number already in use" });
          }

          // Update the pilot record
          const updateQuery =
            "UPDATE pilot SET pilot_name = ?, phone_number = ?, email = ? WHERE pilot_id = ?";
          const updateValues = [
            pilot_name || existingPilot.pilot_name,
            updatedPhoneNumber,
            updatedEmail,
            pilot_id,
          ];

          connection.query(updateQuery, updateValues, (err, results) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Database error", error: err });
            }
            res.status(200).json({ message: "Pilot updated successfully" });
          });
        }
      );
    });
  },
];

module.exports = updatePilot;
