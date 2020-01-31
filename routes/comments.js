var express=require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware"); // will auto require index.js

router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){

	Campground.findById(req.params.id,function(err,campground){
		if(err || !campground){
			req.flash("error","Cannot find campground");
			return res.redirect("back");
		}
			
		else{
			res.render("comments/new",{
                campground:campground,
                currentUser:req.user
			});
		}
	});
	
});
router.post("/campgrounds/:id/comments",middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err)
					req.flash("error","Something went wrong");
				else{
					//add username and id
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//console.log(req.user.username);
					comment.save();
					//console.log(comment.author+" ");
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Succesfully added comment");
					res.redirect("/campgrounds/"+req.params.id);
				}
			});
		}
	});
});
//comment edit
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCamp){
		if(err || !foundCamp){
			req.flash("error","Cannot find Campground");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back");
			}
			else{
				res.render("./comments/edit",{
	
					comment : foundComment,
					campground_id : req.params.id,
					currentUser : req.user
				});
			}
		})
	
	});
		
});
//comments update
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment)
	{
		if(err)
		res.redirect("back");
		else{
			req.flash("success","Comment edited");
			res.redirect("/campgrounds/"+req.params.id);
		}
		
	});
});
//delete comment
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndDelete(req.params.comment_id,function(err){
		if(err)
		res.redirect("back");
		else{
			req.flash("success","Comment deleted");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});



module.exports = router;