const express = require('express');
const dotenv = require('dotenv');
const routers = require("./routers/index");

const app = express();

dotenv.config({
    path: "./config/env/config.env"
})

const PORT = process.env.PORT

//Router Middleware
app.use("/api", routers);

app.get('/',(req,res) => {
    res.send("Hello Serdar");
})

app.listen(PORT, function(){
    console.log(`App Started on ${PORT} : ${process.env.NODE_ENV}`);
});