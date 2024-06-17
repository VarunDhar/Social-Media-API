const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
require("dotenv").config();
module.exports = async (req, res, next) => {
    try {
        const token =req.params.token ;
        if (!token) 
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'No token, authorization denied' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        req.user ={ id:decoded.id}  
        next();
    } catch (err) {
        console.log("here");
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token is not valid: '+ err });
    }
};
