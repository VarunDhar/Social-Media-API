const cookieParser = require("cookie-parser");
const cloudinaryConnect = require("../config/cloudinary-config");
require('dotenv').config();
const express = require('express');
const dbConnect = require("../config/database-config");
const discussionRoutes = require('./routes/discussion-routes');
const PORT = process.env.PORT;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('', discussionRoutes);

cloudinaryConnect();
dbConnect(process.env.DB_URL)

app.listen(PORT, () => {
    console.log(`Discussion Service running on port ${PORT}`);
});
