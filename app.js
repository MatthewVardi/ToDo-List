var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	Task = require("./models/task"),
	User = require("./models/user")
	
var taskRoutes = require("./routes/tasks")
var indexRoutes = require("./routes/index")

app.set("view engine", "ejs"); // for templated ejs files
app.use(express.static("public")); // serve static custom css stylesheet
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method")); //html form for post requests to be converted to put/delete

mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });


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

app.use(indexRoutes);
app.use(taskRoutes);





app.listen(process.env.PORT,process.env.IP, function (){
	console.log("Server has started")
});
