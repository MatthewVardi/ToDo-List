var express = require("express"),
	router  = express.Router(),
	Task    = require("../models/task")

/////////////
//CRUD ROUTES
/////////////

//Create Route
router.post("/todo",isLoggedIn, function (req,res){
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
router.get("/todo/:id/edit",isLoggedIn, function (req,res) {
	Task.findById(req.params.id, function (err, foundTask) {
		if (err) {
			console.log (err) 
		} else {
			res.render("edit", {task:foundTask})
		}
	})
})
//Update Route
router.put("/todo/:id", function (req, res) {
	Task.findByIdAndUpdate(req.params.id,req.body.task, function (err, updatedTask) {
		if (err) {
			console.log(err)
		} else {
			res.redirect("/todo")
		}
	})
})
//Destroy Route
router.delete("/todo/:id", function (req,res) {
	Task.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			console.log(err)
		} else {
			res.redirect("/todo")
		}
	})
});

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