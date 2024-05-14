  const User = require("../models/user_model");
const Provider = require("../models/provider_model.");
const jsonwebtoken = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const bcrypt = require("bcrypt");
const { trace, propfind } = require("../router/auth_router");
const e = require("express");

const jwtVerify = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "No Token Provided" });
    }
    const decoded = jsonwebtoken.verify(token, process.env.JWT_KEY);
    try {
      return res
        .status(200)
        .json({ msg: "Token Verified!", valid: true, decoded });
    } catch (error) {
      return res.status(401).json({ msg: "Invalid Token", error });
    }
  } catch (error) {
    return res.status(401).json({ msg: "Server Error", error });
    console.log(error);
  }
};

const clearCookies = (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ msg: "Cookies Cleared" });
    // res.send('Cookie cleared successfully');
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const userExists = await User.findOne({ phone });
    if (!userExists) {
      return res.status(401).json({ msg: "User Doesn't Exist." });
    }

    const checkPassword = await bcrypt.compare(password, userExists.password);
    if (!checkPassword) {
      return res.status(400).json({ msg: "Incorrect Password", code: 0 });
    }

    const token = await userExists.generateToken();
    res.cookie("token", token);

    res.status(200).json({
      msg: "User Logged In Successfully",
      userId: userExists._id.toString(),
      code: 1,
    });

    console.log("Successful Login ", "Token : ", token);
  } catch (error) {
    console.log("Error While Logging", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const register = async (req, res) => {
  try {
    const { username, fullname, email, phone, password } = req.body;
    const UserExits = await User.findOne({ phone });
    if (UserExits) {
      res.status(200).json({ msg: "User Already Exists", code: 0 });
      console.log("User Already Exists bsdk.");
      return;
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userCreated = await User.create({
        username,
        fullname,
        email,
        phone,
        password: hashedPassword,
        image :{
          url: 'https://i.pinimg.com/1200x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg'
        }
      });

      const token = await userCreated.generateToken();
      res.status(201).json({
        msg: "User Created Sucessfully",
        code: 1,
        userID: userCreated._id.toString(),
      });
      console.log("User Created Successfully bkl", token);
    }
  } catch (error) {
    res.status(401).json({ msg: "Some Error Occured While Registering." });
    console.log("Some Error While Registering.", error);
  }
};

const getUserDetails = async (req, res) => {
  try {
    let userType = User;
    const data = req.body.decoded;
    console.log(data);
    if (data.isProvider) userType = Provider;

    const user = await userType.findOne({
      _id: ObjectId.createFromHexString(data.userID),
    });
    console.log(user);
    if (user) {
      res.status(200).json({ msg: "Sucessfully Data Found ", user });
      console.log("User Successfully Found");
      return;
    }
    console.log("Some Error");
    res.status(400).json({ msg: "Error during Search " });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Some Error has occured. " });
  }
};


const editUserDetails = async (req, res) => {
  try {
    const reqData = req.body;
    console.log("Data From Body " ,reqData);
    let userType = User;
    if (reqData.isProvider) userType = Provider;

    const user = await userType.updateOne(
      { phone: reqData.phone },
      {
        $set: {
          profession: reqData.profession,
          username: reqData.username,
          fullname: reqData.fullname,
          phone: reqData.phone,
          city: reqData.city,
          email: reqData.email,
          address : reqData.address 
        },
      }
    );
    const updatedUser = await userType.findOne({ phone: reqData.phone });
    console.log("Details Successfully Updated" ,updatedUser);
    res.status(200).json({ msg: "Details Successfully Updated" , code : 1});
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something Went Wrong!" });
  }
};

module.exports = {
  clearCookies,
  register,
  login,
  jwtVerify,
  getUserDetails,
  editUserDetails,
};
