const connection=require('../mysql/mysql')
const deleteDrone = require('./deleteDrone')

const deleteOrder=(req,res)=>{
  const order_id=parseInt(req.params.order_id)

  if(isNaN(order_id)){
    return res.status(400).json({message:"Invalid Part Id"})
  }

  const query='DELETE FROM drone_parts_orders WHERE order_id=?'
  connection.query(query,[order_id],(err,results)=>{
    if(err){
      return res.status(500).json({message: 'Database error', error: err })
    }
    if(results.affetedRows===0){
      return res.status(404).json({ message: 'drone part not found' })
    }

    res.status(200).json({message:"Drone Part deleted Successfully"})
  })
}
module.exports=deleteOrder;