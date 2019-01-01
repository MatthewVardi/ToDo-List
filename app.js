var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	mongoose = require("mongoose")
	

app.set("view engine", "ejs"); // for templated ejs files
app.use(express.static("public")); // serve static custom css stylesheet
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/todoDB", { useNewUrlParser: true });

//MONGOOSE/MODEL CONFIG
var taskSchema = new mongoose.Schema({
    body:String,
    created: {type: Date, default: Date.now}
});

var Task = mongoose.model("Task", taskSchema)

// Task.create({
//     body: "Test Task"
// });



//Home Route
app.get("/", function (req,res){
	res.redirect("todo")
});

//ToDo Route
app.get("/todo", function (req,res){
	Task.find({}, function(err,tasks){
	        if (err) {
	            console.log(err)
	        } else {
	            res.render("todo", {tasks:tasks});
	        }
	    })
});


//Create Route
app.post("/todo", function (req,res){
	console.log(req.body.task)
	Task.create(req.body.task, function (err, newTask) {
		if (err) {
			console.log(err)
		} else {
			res.redirect("todo")
		}
	})
})



app.listen(3000, function (){
	console.log("Server has started")
});
