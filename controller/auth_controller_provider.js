const Provider = require("../models/provider_model.");
const bcrypt = require('bcrypt');

const registerProvider = async (req, res) => {
  try {
     const { profession, fullname, username, password, phone, address, city } = req.body;
     const providerExists = await Provider.findOne({ phone });
     if (providerExists) {
       return res.status(400).json({ msg: "Provider Already Exists, Please Login" , code : 0 });
     } else {
       const hashedPassword = await bcrypt.hash(password, 10);
       const providerCreated = await Provider.create({
         profession,
         username,
         fullname,
         password: hashedPassword,
         phone,
         address,
         city,
         image :{
          url: 'https://i.pinimg.com/1200x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg'
        }
       });
       console.log("Provider Created Successfully" , providerCreated);
       return res.status(201).json({ msg: "Provider Created Successfully.", code : 1 });
     }
  } catch (error) {
     console.log(error);
     return res.status(500).json({ msg: "Server Error" });
  }
 };
 

const loginProvider = async (req , res)=>{
  try {
    const {phone , password} = req.body;
    const providerExists = await Provider.findOne({phone});
    if(!providerExists){
      console.log("Create A Provider First");
      res.status(400).json({msg:"Provider Doesn't Exists"});
    }
    else{
      const comparePass = await bcrypt.compare(password , providerExists.password);
      if(comparePass){
        console.log("Provider Exists!!");

        const token = await providerExists.generateToken();
        res.cookie('token',token);

        res.status(200).json({
          msg: "Provider Logged In Successfully",
          code : 1
        });
    
        console.log("Successful Login As Provider","Token : ", token); 
      }
      else{
        console.log("Invalid Credentails");
      res.status(400).json({msg:"Invalid Credentails" , code : 0});
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({msg:"Server Error While Provider Login"});
  }  
}

module.exports = {loginProvider , registerProvider}