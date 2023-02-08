const { Schema, model } = require("mongoose");
const mongoose = require('mongoose')

const addressSchema = new Schema({
    addressType:{
        type:String,
        enum:['Home','Office','Other'],
        default:'Home',
    },
    street: {
        type: String,
        required: true
      },
    city: {
        type: String,
        required: true
      },
    state: {
        type: String,
        required: true
      },
    zip: {
        type: String,
        required: true
      },
    user:{type:mongoose.Types.ObjectId,ref:'User'},
})

const User = model("Address", addressSchema);

module.exports = Address;