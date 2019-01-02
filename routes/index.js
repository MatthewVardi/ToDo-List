var express = require("express"),
    router  = express.Router(),
    Task    = require("../models/task"),
    User    = require("../models/user"),
    passport = require("passport")



//Home Route
router.get("/", function (req,res){
	res.redirect("todo")
});

//ToDo Route
router.get("/todo",isLoggedIn, function (req,res){
	Task.find({}, function(err,tasks){
	        if (err) {
	            console.log(err)
	        } else {
	            res.render("todo", {tasks:tasks});
	        }
	    })
});




/////////////
//AUTH ROUTES
/////////////

//Show sign up form
router.get("/register", function(req, res) {
    //Show sign up form
    res.render("register");
})

//Handling user sign up
router.post("/register", function (req,res){
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
router.get("/login", function(req, res) {
   res.render("login");
});

//Login Logic
//passport.authenticate will take the password from the form and compare to the hashed version in the DB
router.post("/login", passport.authenticate("local",{
    successRedirect: "/todo",
    failureRedirect: "/login"
}) ,function (req,res){
    //empty callback function in here
})

//Log out logic
//Single get route with req.logout()
router.get("/logout", function(req,res){
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

module.exports = router;