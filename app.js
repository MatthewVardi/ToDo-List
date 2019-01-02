var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose")
	

app.set("view engine", "ejs"); // for templated ejs files
app.use(express.static("public")); // serve static custom css stylesheet
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/todoDB", { useNewUrlParser: true });



//USER SCHEMA
var userSchema = new mongoose.Schema({
    username: String,
    password: String
});
//Adds authenticate method for local strategy
userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);

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

var Task = mongoose.model("Task", taskSchema)


app.use(require("express-session")({
    secret: "Keyboard 987654321",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize()) // tell express to use passport
app.use(passport.session()) // tell express to use sesions

passport.use(new LocalStrategy(User.authenticate()))
//Responsible for reading the session,taking the data and encode / unencode
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this middleware passes the current user to every route
//using it to display current login information
app.use(function(req,res,next) {
   res.locals.currentUser = req.user;
   next();
});

//Home Route
app.get("/", function (req,res){
	res.redirect("todo")
});

//ToDo Route
app.get("/todo",isLoggedIn, function (req,res){
	Task.find({}, function(err,tasks){
	        if (err) {
	            console.log(err)
	        } else {
	            res.render("todo", {tasks:tasks});
	        }
	    })
});


/////////////
//CRUD ROUTES
/////////////

//Create Route
app.post("/todo",isLoggedIn, function (req,res){
	Task.create(req.body.task, function (err, newTask) {
		if (err) {
			console.log(err)
		} else {
			//Associate user ID with task
			newTask.author.id = req.user._id
			newTask.save()
			res.redirect("/todo")
		}
	})
})
//Edit Route
app.get("/todo/:id/edit",isLoggedIn, function (req,res) {
	Task.findById(req.params.id, function (err, foundTask) {
		if (err) {
			console.log (err) 
		} else {
			res.render("edit", {task:foundTask})
		}
	})
})
//Update Route
app.put("/todo/:id", function (req, res) {
	Task.findByIdAndUpdate(req.params.id,req.body.task, function (err, updatedTask) {
		if (err) {
			console.log(err)
		} else {
			res.redirect("/todo")
		}
	})
})
//Destroy Route
app.delete("/todo/:id", function (req,res) {
	Task.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			console.log(err)
		} else {
			res.redirect("/todo")
		}
	})
});

/////////////
//AUTH ROUTES
/////////////

//Show sign up form
app.get("/register", function(req, res) {
    //Show sign up form
    res.render("register");
})

//Handling user sign up
app.post("/register", function (req,res){
    //This format will hash the password (we passed the password separately below)
    User.register(new User({username: req.body.username}), req.body.password, function (err,user){
       if (err) {
           console.log(err)
           res.render("register");
       }
       passport.authenticate("local")(req, res, function(){
           res.redirect("/todo");
       })
    });
});

//Render login form
app.get("/login", function(req, res) {
   res.render("login");
});

//Login Logic
//passport.authenticate will take the password from the form and compare to the hashed version in the DB
app.post("/login", passport.authenticate("local",{
    successRedirect: "/todo",
    failureRedirect: "/login"
}) ,function (req,res){
    //empty callback function in here
})

//Log out logic
//Single get route with req.logout()
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/login")
})

//Authorization Middleware
//middleware function to allow certain pages like /secret only when logged in 
function isLoggedIn(req, res, next){
    //continue if good
    if (req.isAuthenticated()) {
        return next();
    }
    //otherwise redirect to login
    res.redirect("/login");
}


app.listen(3000, function (){
	console.log("Server has started")
});
