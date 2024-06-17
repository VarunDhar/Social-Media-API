const express = require('express');
const cookieParser = require("cookie-parser");
const routesRouter = require("./routes/user-routes");
require("dotenv").config();
const app = express();
const {PORT} = process.env;
const dbConnect = require("../config/database-config");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use('', routesRouter);

dbConnect(process.env.DB_URL);

app.listen(PORT, (req,res)=>{
    console.log(`Server running successfully on port : ${PORT}`);
});