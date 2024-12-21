const express = require("express");
const router = express.Router();
const authenticateToken = require('../middleware/authenticate'); 



const AdminLogin = require('../controller/Adminlogin');

const addPilot =require('../controller/addPilot')
const updatePilot =require('../controller/updatePilot')
const {fetchPilots,totalPilots,fetchPilotById}=require("../controller/fetchPilot")
const deletePilot = require("../controller/deletePilot");

const {contactRequests,totalRequests}=require("../controller/contactRequest")

const addPart=require("../controller/addDrone")
const { fetchAllParts, fetchPartById,totalParts } = require("../controller/fetchDrone");
const updatePart=require("../controller/updateDrone")
const deletePart=require("../controller/deleteDrone")

const fetchTask = require('../controller/fetchTasks');
const addTask=require('../controller/addTask')
const updateTask=require('../controller/updateTask')
const deleteTask = require('../controller/deleteTask');


const addOrder=require('../controller/addOrder')
const fetchOrders=require("../controller/fetchOrder")
const updateOrder=require("../controller/updateOrder")
const deleteOrder=require("../controller/deleteOrder")



router.post('/login', AdminLogin);

// contact Requests
router.get("/request",authenticateToken,contactRequests)
router.get("/totalrequest",totalRequests)

// pilots
router.post("/addpilot",authenticateToken, addPilot)
router.put("/updatepilot/:pilot_id" , updatePilot)
router.get("/fetchpilot" , fetchPilots)
router.get("/fetchpilot/:pilot_id" , fetchPilotById)
router.get("/totalpilots" , totalPilots)

router.delete("/deletepilot/:pilot_id" ,authenticateToken, deletePilot)


//drone parts
router.post("/addpart",authenticateToken,addPart)
router.put("/updatepart/:part_id",updatePart)
router.get("/fetchparts",authenticateToken, fetchAllParts); 
router.get("/fetchpart/:part_id", fetchPartById);
router.get("/totalparts",totalParts)

router.delete("/deletepart/:part_id",authenticateToken,deletePart)




// tasks
router.get('/fetchtasks', authenticateToken,fetchTask.fetchAllTasks);
router.get('/fetchtask/:service_id', fetchTask.fetchTaskById);
router.get('/totaltasks',fetchTask.totaltasks)
router.get('/fetchtasks/pilot/:assigned_to_pilot_id', fetchTask.fetchTasksByPilotId);
router.get('/fetchtasks/contact/:contact_request_id', fetchTask.fetchTasksByContactRequestId);
router.post('/addtask',authenticateToken,addTask)
router.put('/updatetask/:service_id',updateTask)

router.delete('/deletetask/:service_id',authenticateToken, deleteTask);


// Orders
router.post('/addorder',authenticateToken,addOrder)
router.get('/fetchorder',authenticateToken,fetchOrders.fetchAllOrders)
router.get('/totalorders',fetchOrders.totalOrders)
router.get('/fetchorder/:order_id',fetchOrders.fetchOrderById)
router.put('/updateorder/:order_id',updateOrder)

router.delete('/deleteorder/:order_id',authenticateToken,deleteOrder)








// Testing purpose
router.get('/', (req, res) => {
  res.send("API is working");
});

module.exports = router;
