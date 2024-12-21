const { body, param, validationResult } = require("express-validator");
const connection = require("../mysql/mysql");

const updateTask = [
  param("service_id")
    .isInt()
    .withMessage("Service ID must be an integer")
    .toInt(),

  body("acres")
    .optional()
    .isDecimal()
    .withMessage("Acres must be a valid decimal number")
    .toFloat(),

  body("field_type")
    .optional()
    .isString()
    .withMessage("Field type must be a string")
    .trim()
    .escape(),

  body("assigned_to_pilot_id")
    .optional()
    .isInt()
    .withMessage("Assigned pilot ID must be an integer")
    .toInt(),

  body("assigned_date")
    .optional()
    .isDate()
    .withMessage("Assigned date must be a valid date"),

  body("status")
    .optional()
    .isIn(['Completed', 'Pending', 'Cancelled'])
    .withMessage("Status must be either 'Completed', 'Pending', 'Cancelled', or 'In Progress'"),

  body("contact_request_id")
    .optional()
    .isInt()
    .withMessage("Contact request ID must be an integer")
    .toInt(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { acres, field_type, assigned_to_pilot_id, assigned_date, status, contact_request_id } = req.body;
    const { service_id } = req.params;

    // Checking if the service id exists or not
    const checkExistingServiceQuery = "SELECT * FROM drone_services WHERE service_id = ?";
    connection.query(checkExistingServiceQuery, [service_id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Service not found" });
      }

      // Check for existing contact request ID
      const existingService = results[0];
      const updatedContactRequestId = contact_request_id || existingService.contact_request_id;

      const checkDuplicateQuery =
        "SELECT * FROM drone_services WHERE contact_request_id = ? AND service_id != ?";
      connection.query(
        checkDuplicateQuery,
        [updatedContactRequestId, service_id],
        (err, results) => {
          if (err) {
            return res.status(500).json({ message: "Database error", error: err });
          }

          if (results.length > 0) {
            return res.status(400).json({ message: "Contact request ID already in use" });
          }

          // Update the service record
          const updateQuery =
            "UPDATE drone_services SET acres = ?, field_type = ?, assigned_to_pilot_id = ?, assigned_date = ?, status = ?, contact_request_id = ? WHERE service_id = ?";
          const updateValues = [
            acres !== undefined ? acres : existingService.acres,
            field_type !== undefined ? field_type : existingService.field_type,
            assigned_to_pilot_id !== undefined ? assigned_to_pilot_id : existingService.assigned_to_pilot_id,
            assigned_date !== undefined ? assigned_date : existingService.assigned_date,
            status !== undefined ? status : existingService.status,
            updatedContactRequestId,
            service_id,
          ];

          connection.query(updateQuery, updateValues, (err, results) => {
            if (err) {
              return res.status(500).json({ message: "Database error", error: err });
            }
            res.status(200).json({ message: "Service updated successfully" });
          });
        }
      );
    });
  },
];

module.exports = updateTask;
