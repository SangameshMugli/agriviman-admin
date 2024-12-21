const connection = require('../mysql/mysql');


const deleteDrone = (req, res) => {
  const part_id = parseInt(req.params.part_id);

  if (isNaN(part_id)) {
    return res.status(400).json({ message: 'Invalid part ID' });
  }

  const query = 'DELETE FROM drone_parts WHERE part_id = ?';
  connection.query(query, [part_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'drone part not found' });
    }

    res.status(200).json({ message: 'Drone Part deleted successfully' });
  });
};

module.exports =  deleteDrone;
