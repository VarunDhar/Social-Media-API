const {StatusCodes} = require("http-status-codes");
const {successResponse} = require("../../utils/common");
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

async function signup(req, res){
    const { name, mobileNo, email, password } = req.body;
    try {
        const user = new User({ name, mobileNo, email, password });
        await user.save();
        successResponse.data = "User created successfully: "+user.name;
        return res.status(StatusCodes.CREATED).json(successResponse);
    } catch (err) {        
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
    }
};

async function login (req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
             return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
             return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id },SECRET_KEY, { expiresIn: '5h' });
        res.setHeader('Authorization', `Bearer ${token}`);
        return res.cookie("token",token,{
            expires:new Date(Date.now() + 5*24*60*60*1000),
            httpOnly:true
        }).status(StatusCodes.OK).json({
            success:true,
            message:"User logged in successfully.",
            user:user.name
        })
        
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

async function getAllUsers(req, res){
    try {
        const users = await User.find().select("-password -mobileNo -email -followers -following -__v");
        successResponse.data = users;
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

async function getUserByName(req, res){
    try {
        const {name} = req.query;
        const user = await User.find({ name: new RegExp(name,'i') }).select("-password -mobileNo -email -followers -following -__v");
        if (!user)
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        successResponse.data = user;
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

async function updateUser(req, res){
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user)
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        successResponse.data = "User updated successfully :"+ user.name;
        //console.log("here");
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

async function deleteUser(req, res){
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        // res.json({ message: 'User deleted successfully' });
        successResponse.data = 'User deleted successfully:'+user.name;
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

async function followUser(req, res){
    try {
        const user = await User.findById(req.user.id);
        const userToFollow = await User.findById(req.params.id);
        if (!userToFollow) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });

        if (user.following.includes(userToFollow._id)) {
            user.following.pull(userToFollow._id);
            userToFollow.followers.pull(user._id);
        } else {
            user.following.push(userToFollow._id);
            userToFollow.followers.push(user._id);
        }

        await user.save();
        await userToFollow.save();
        return res.json({ message: `Follow status updated for ${user.name}` });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

module.exports = {
    login,
    signup,
    getAllUsers,
    getUserByName,
    updateUser,
    followUser,
    deleteUser
};
