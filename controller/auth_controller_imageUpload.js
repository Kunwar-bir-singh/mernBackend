const User = require("../models/user_model");
const Provider = require("../models/provider_model.");
const { uploadToCloudinary } = require("../utils/cloudinary");
const ObjectId = require('mongodb').ObjectId; 

const getImage = async (req, res) => {
  const data = req.body;
  console.log(data);
  let userType = User;
  try {
    if (data.isProvider) userType = Provider;
    console.log("userType is : ", userType);
    const user = await userType.findOne(new ObjectId(data.userID))
    console.log(user);
    if (user) {
      res.status(200).json(user.image.url);
      return
    }
  } catch (error) {
    console.log("Some Error has occured.", error);
    res.status(500).json({ error: "Some Error has occured." });
  }
};

const createImage = async (req, res) => {
  const data = req.body;
  let userType = User;
  const userDetails = data.userDetails;
  const image = data.image;
  try {
    let imageData = {};
    if (userDetails.isProvider) userType = Provider;
    if (image) {
      const results = await uploadToCloudinary(image, "profilePictures");
      imageData = results;
    }
    const user = await userType.updateOne(
      { phone: userDetails.phone },
      {
        $set: {
          image: imageData,
        },
      }
    );
    console.log("Image Updated Successfully");
    res.status(200).json({ msg: "Image Updated Successfully", code: 1 });
  } catch (e) {
    console.log("Some Error has occured.", e);
    res.status(500).json({ error: "Some Error Occured", code: 1 });
  }
};

module.exports = { createImage, getImage };
