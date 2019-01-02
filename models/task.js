var mongoose = require("mongoose")

//TASK SCHEMA 
var taskSchema = new mongoose.Schema({
    body:String,
    created: {type: Date, default: Date.now},
    author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   }
});

module.exports = mongoose.model("Task", taskSchema)