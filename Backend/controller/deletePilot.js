const connection = require('../mysql/mysql');


const deletePilot = (req, res) => {
  const pilot_id = parseInt(req.params.pilot_id);

  if (isNaN(pilot_id)) {
    return res.status(400).json({ message: 'Invalid pilot ID' });
  }

  const query = 'DELETE FROM pilot WHERE pilot_id = ?';
  connection.query(query, [pilot_id], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Pilot not found' });
    }

    res.status(200).json({ message: 'Pilot deleted successfully' });
  });
};

module.exports =  deletePilot;
