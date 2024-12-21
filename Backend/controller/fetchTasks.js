const connection = require("../mysql/mysql");

// Fetch all tasks
const fetchAllTasks = (req, res) => {
  const query = `
  SELECT 
    ds.service_id,
    ds.service,
    ds.acres,
    ds.field_type,
    ds.assigned_date,
    ds.status,
    ds.assigned_to_pilot_id ,  
    ds.contact_request_id ,  
    p.pilot_name,
    c.name 
  FROM 
    drone_services ds
  LEFT JOIN 
    pilot p ON ds.assigned_to_pilot_id = p.pilot_id
  LEFT JOIN 
    contact_form_request c ON ds.contact_request_id = c.request_id
  `;
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results);
  });
};

// Fetch task by service_id
const fetchTaskById = (req, res) => {
  const { service_id } = req.params;
  const query = `
  SELECT 
  ds.service_id,
  ds.service,
  ds.acres,
  ds.field_type,
  ds.assigned_date,
  ds.status,
  ds.assigned_to_pilot_id,  
  ds.contact_request_id,  
  p.pilot_name,
  c.name
FROM 
  drone_services ds
LEFT JOIN 
  pilot p ON ds.assigned_to_pilot_id = p.pilot_id
LEFT JOIN 
  contact_form_request c ON ds.contact_request_id = c.request_id
WHERE 
  ds.service_id = ?; `;
  connection.query(query, [service_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(results[0]);
  });
};

// Fetch tasks by pilot_id
const fetchTasksByPilotId = (req, res) => {
  const { assigned_to_pilot_id } = req.params;
  const query = `
  SELECT 
  ds.service_id,
  ds.service,
  ds.acres,
  ds.field_type,
  ds.assigned_date,
  ds.status,
  ds.assigned_to_pilot_id,  
  ds.contact_request_id,  
  p.pilot_name,
  c.name
FROM 
  drone_services ds
LEFT JOIN 
  pilot p ON ds.assigned_to_pilot_id = p.pilot_id
LEFT JOIN 
  contact_form_request c ON ds.contact_request_id = c.request_id
WHERE 
  ds.assigned_to_pilot_id = ?;`
  connection.query(query, [assigned_to_pilot_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results);
  });
};

// Fetch tasks by contact_request_id
const fetchTasksByContactRequestId = (req, res) => {
  const { contact_request_id } = req.params;
  const query = `
  SELECT 
    ds.service_id,
    ds.service,
    ds.acres,
    ds.field_type,
    ds.assigned_date,
    ds.status,
    ds.assigned_to_pilot_id AS pilot_id,  
    ds.contact_request_id AS request_id,  
    p.pilot_name,
    c.name 
  FROM 
    drone_services ds
  LEFT JOIN 
    pilot p ON ds.assigned_to_pilot_id = p.pilot_id
  LEFT JOIN 
    contact_form_request c ON ds.contact_request_id = c.request_id
  WHERE 
    ds.contact_request_id = ?;
  `;
  connection.query(query, [contact_request_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(results);
  });
};

const totaltasks=(req,res)=>{
  const query="select count(*) from  drone_services where status='Pending' "
  connection.query(query,(err,results)=>{
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results);

  })
}

module.exports = {
  fetchAllTasks,
  fetchTaskById,
  fetchTasksByPilotId,
  fetchTasksByContactRequestId,
  totaltasks
};
