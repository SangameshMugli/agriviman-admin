const connection =require("../mysql/mysql")


const fetchPilots=(req,res)=>{
  
  const query = 'SELECT * FROM pilot';
  connection.query(query,  (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    
    res.status(200).json(results);
  });
}

const fetchPilotById=(req,res)=>{
  const {pilot_id}=req.params;
  const query="select * from pilot "
  connection.query(query,[pilot_id],(err,results)=>{
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(results);
  })
}

const totalPilots=(req,res)=>{
  const query="select count(*) as total from pilot"
  connection.query(query,(err,results)=>{
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results);
  })
}

module.exports={fetchPilots,totalPilots,fetchPilotById};