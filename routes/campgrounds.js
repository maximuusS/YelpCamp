var express= require("express");
var router = express.Router();
var Campground = require("../models/campground"); 

router.get("/campgrounds",function(req,res){
	console.log(req.user);
	Campground.find({},function(err,campgrounds){
		if(err){
			console.log("err");
			
		}else{
			res.render("campgrounds/index",{
		campgrounds: campgrounds,
		currentUser:req.user
	});
		}
	});
	
});


router.post("/campgrounds",function(req,res){
	
	var name=req.body.name;
	var description=req.body.description;
	var image=req.body.image;
	var newCampground={
		name: name, image:image, description:description
	};
	//campgrounds.push(newCampground);
	Campground.create(newCampground,function(err,newlyCreated){
		if(err)	
			console.log("error");
		else{
			res.redirect("/campgrounds");
		}
											  });
	
});

router.get("/campgrounds/new",function(req,res){
	res.render("campgrounds/new",{
        currentUser:req.user
    });
	
});

router.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
        if(err)
            console.log("Error");
        else{
            console.log(foundCamp);
            res.render("campgrounds/show",{
                campground:foundCamp,
                currentUser:req.user
            });
        }
    });
});
module.exports = router;