const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let userSchema = new Schema({
  userId: {
    type: String,
    default: '',
    
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  /*
  title: {
    type: String,
    default: 'No Title is set'
  },
  purpose:{
    type: String,
    default: 'No purpose is set'
  },
  start:{
    type:Date,
    default:''
  },
  end:{
    type:Date,
    default:''
  },
  adminName:{
    type:String,
    default:undefined
  },*/
newData : []

})


mongoose.model('Calender', userSchema);