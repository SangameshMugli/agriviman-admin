const connection = require("../mysql/mysql");

const deleteTask = (req, res) => {
  const { service_id } = req.params;

  const query = 'DELETE FROM drone_services WHERE service_id = ?';
  
  connection.query(query, [service_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  });
};

module.exports = deleteTask;
