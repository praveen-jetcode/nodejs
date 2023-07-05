const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const DriversSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    age:{
        type:Number,
        require:true
    },
})



const Drivers = mongoose.model('Drivers' , DriversSchema);
module.exports = Drivers;