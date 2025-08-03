require('dotenv').config();
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: String,
});

function dateFormat(date){
  return date.toDateString();
}

const exerciseSchema = new mongoose.Schema({
  description: String,
  duration: Number,
  date: {
    type:Date,
    get: dateFormat
  },
  user:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  }
},{toJSON: {getters: true}})


const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);


exports.User = User;
exports.Exercise = Exercise;
exports.mongoose = mongoose;
