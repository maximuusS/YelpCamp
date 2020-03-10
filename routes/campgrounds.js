var express= require("express");
var router = express.Router();
var moment=require('moment');
var Campground = require("../models/campground"); 
var middleware = require("../middleware"); // will auto require index.js

router.get("/campgrounds",function(req,res){
	console.log(req.user);
	Campground.find({},function(err,campgrounds){
		if(err){
			console.log("err");
			
		}else{
			res.render("campgrounds/index",{
		campgrounds: campgrounds,
		currentUser:req.user,
		moment: moment
	});
		}
	});
	
});


router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
	
	var name=req.body.name;
	var description=req.body.description;
	var image=req.body.image;
	var price=req.body.price;
	var author = {
		id:req.user._id,
		username:req.user.username
	}; 	
	var newCampground={
		name: name, image:image, description:description , author:author ,price:price
	};
	//campgrounds.push(newCampground);
	Campground.create(newCampground,function(err,newlyCreated){
		if(err)	
			console.log("error");
		else{
			req.flash("success","Campground created!");
			res.redirect("/campgrounds");
		}
											  });
	
});

router.get("/campgrounds/new",middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new",{
        currentUser:req.user
    });
	
});

router.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
        if(err || !foundCamp){
			console.log("Error");
			req.flash("error","Campground not found");
			res.redirect("back");
		}
            
        else{
            console.log(foundCamp);
            res.render("campgrounds/show",{
                campground:foundCamp,
				currentUser:req.user,
				moment : moment
            });
        }
    });
});

//Edit campground
router.get("/campgrounds/:id/edit",middleware.checkOwnership, function(req,res){
	
			Campground.findById(req.params.id,function(err, foundCamp){
				res.render("campgrounds/edit",{
					campground : foundCamp,
					currentUser:req.user
				});
							
		});
});


//Update Campground
router.put("/campgrounds/:id",middleware.checkOwnership, function(req,res){
	
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err , updateCampground){
		if(err)
		res.redirect("/campgrounds");
		else{
			req.flash("success","Campground updated");
			res.redirect("/campgrounds/" + req.params.id);
			//updateCampground
		}
	});	
});
//DELETE
router.delete("/campgrounds/:id",middleware.checkOwnership	,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err)
		res.redirect("/campgrounds");
		else{
			req.flash("success","Campground deleted!");
			res.redirect("/campgrounds");
		}
		
	});
	
});


	

module.exports = router;