const mongoose = require('mongoose');

const professionSchema = new mongoose.Schema({
    name :{
        type : String,
        require: true
    },
    city : {
        type: String,
        require: true
    },
    provider:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Provider"
    }]
})

const Profession = new mongoose.model("Profession" , professionSchema);
module.exports = Profession;

