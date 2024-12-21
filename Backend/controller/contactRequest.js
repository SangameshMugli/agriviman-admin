const connection =require("../mysql/mysql")

const contactRequests=(req,res)=>{
  

  const query="select * from contact_form_request "
  connection.query(query,(err,results)=>{
    if(err){
      return res.status(500).json({message:"Database error",error:err})
    }
    
    res.status(200).json(results);
  })



}

const totalRequests=(req,res)=>{
  const query="select count(*) AS total FROM contact_form_request"
  connection.query(query,(err,results)=>{
    if(err){
      return res.status(500).json({message:"Database error",error:err})
    }
    
    res.status(200).json(results);

  })
}

module.exports={contactRequests,totalRequests}