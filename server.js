const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require('./helpers/database/connectDatabase');
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const routers = require("./routers/index");
//path express içindeki bir paket
const path = require('path');

const app = express();

dotenv.config({
    path: "./config/env/config.env"
});

// MongoDB Connection
connectDatabase();

//Express - Body Middleware
app.use(express.json());


const PORT = process.env.PORT

//Router Middleware
app.use("/api", routers);

//Error Handler
app.use(customErrorHandler);

//Static Files
app.use(express.static(path.join(__dirname, "public"))); // yaptığı iş dirname ile public ismini bağlamak
console.log(path.join(__dirname, "public")); //örnek

app.listen(PORT, function(){
    console.log(`App Started on ${PORT} : ${process.env.NODE_ENV}`);
});