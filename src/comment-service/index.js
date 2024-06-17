const express = require('express');
const cookieParser = require("cookie-parser");
const routesRouter = require("./routes/comment-routes");
const dbConnect = require("../config/database-config");
require("dotenv").config();
const {PORT} = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use('', routesRouter);

dbConnect(process.env.DB_URL);

app.listen(PORT, (req,res)=>{
    console.log(`Server running successfully on port : ${PORT}`);
});