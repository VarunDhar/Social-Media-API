require("dotenv").config();
const mongoose = require("mongoose");


async function dbConnect(DB_URL){
    try {
        await mongoose.connect(DB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("SUCCESS:Connection to DB successful.");
    } catch (error) {
        console.log("ERROR: connecting to DB.");
    }
}

module.exports = dbConnect;