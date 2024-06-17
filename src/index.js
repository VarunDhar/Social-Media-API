const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const proxy = require('express-http-proxy');

app.use(cookieParser());
app.use('/api/v1/user', proxy(process.env.USER_SERVICE_URL));
app.use('/api/v1/discussion', proxy(process.env.DISCUSSION_SERVICE_URL));
app.use('/api/v1/comment', proxy(process.env.COMMENT_SERVICE_URL));

app.listen(4000, (req,res)=>{
    console.log(`API Gateway running successfully on port : 4000`);
});