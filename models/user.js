var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")

//USER SCHEMA
var userSchema = new mongoose.Schema({
    username: String,
    password: String
});
//Adds authenticate method for local strategy
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);