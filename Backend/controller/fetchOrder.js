const connection=require("../mysql/mysql")

// fetching all the orders 
const fetchAllOrders=(req,res)=>{
  const query=`SELECT o.order_id,o.part_id,o.quantity,o.status,o.ordered_date,o.request_id,o.total_price,dp.part_name,c.name,c.phone_number,c.email
  FROM drone_parts_orders o
  LEFT JOIN drone_parts dp ON o.part_id=dp.part_id
  LEFT JOIN contact_form_request c ON o.request_id=c.request_id`;

  connection.query(query,(err,results)=>{
    if(err){
      return res.status(500).json({message:'Database error',error:err})
    }
    res.status(200).json(results)
  })
}

// Fetch order by order_id
const fetchOrderById = (req, res) => {
  const { order_id } = req.params;
  const query = `
  SELECT 
    o.order_id,
    o.part_id,
    o.quantity,
    o.ordered_date,
    o.status,
    o.request_id,
    o.total_price,
    dp.part_name,
    c.name AS contact_name,
    c.phone_number,
    c.email
  FROM 
    drone_parts_orders o
  LEFT JOIN 
    drone_parts dp ON o.part_id = dp.part_id
  LEFT JOIN 
    contact_form_request c ON o.request_id = c.request_id
  WHERE 
    o.order_id = ?;
  `;
  connection.query(query, [order_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(results[0]);
  });
};

const totalOrders=(req,res)=>{
  const query="select count(*) from drone_parts_orders where status='In Transit'"
  connection.query(query,(err,results)=>{
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results);


  })
}

module.exports={fetchAllOrders,fetchOrderById,totalOrders}