const connection =require("../mysql/mysql")


const fetchAllParts=(req,res)=>{
  
  const query = 'SELECT * FROM drone_parts';
  connection.query(query,  (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    
    res.status(200).json(results);
  });
}

const fetchPartById = (req, res) => {
  const { part_id } = req.params;

  const query = `
    SELECT part_id, part_name, quantity, DATE_FORMAT(date_of_manufacture, '%Y-%m-%d') as date_of_manufacture ,Price
    FROM drone_parts 
    WHERE part_id = ?
  `;

  connection.query(query, [part_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Drone part not found' });
    }

    res.status(200).json(results[0]);
  });
};


const totalParts=(req,res)=>{
  const query="select count(*) as total from drone_parts"
  connection.query(query,(err,results)=>{
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results);

  })

}


module.exports={fetchAllParts,fetchPartById,totalParts}