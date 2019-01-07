const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let todoSchema = new Schema({
  
  userId: {
    type: String,
    default: '',
    
  },
  email: {
    type: String,
    default: ''
  },
  isChecked : {
      type:Boolean,
      default:false
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
todoList : [],
childId :  {
  type: String,

},
editedBy :  {
  type: String,

}

})


mongoose.model('todoSchema', todoSchema);