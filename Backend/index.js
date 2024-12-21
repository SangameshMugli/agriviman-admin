const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const cors = require('cors');
const routes = require('./routes/routes');
const errorHandler=require("./controller/errorHandler")
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

app.use(errorHandler)

const port = process.env.PORT;

app.listen(port, function(err) {
  if (err) {
    console.log("Error starting the server:", err);
  }
  console.log(`Server started at port number ${port}`);
});
