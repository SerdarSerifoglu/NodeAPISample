const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require('./helpers/database/connectDatabase');
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const routers = require("./routers/index");

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

app.get('/',(req,res) => {
    res.send("Hello Serdar");
})

app.listen(PORT, function(){
    console.log(`App Started on ${PORT} : ${process.env.NODE_ENV}`);
});