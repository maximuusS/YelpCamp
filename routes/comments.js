var express=require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err)
			console.log(err);
		else{
			res.render("comments/new",{
                campground:campground,
                currentUser:req.user
			});
		}
	});
	
});
router.post("/campgrounds/:id/comments",isLoggedIn, function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err)
					console.log(err);
				else{
					//add username and id
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//console.log(req.user.username);
					comment.save();
					//console.log(comment.author+" ");
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+req.params.id);
				}
			});
		}
	});
});
//comment edit
router.get("/campgrounds/:id/comments/:comment_id/edit",checkCommentOwnership,function(req,res){
	
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
//comments update
router.put("/campgrounds/:id/comments/:comment_id",checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment)
	{
		if(err)
		res.redirect("back");
		else
		res.redirect("/campgrounds/"+req.params.id);
	});
});
//delete comment
router.delete("/campgrounds/:id/comments/:comment_id",checkCommentOwnership,function(req,res){
	Comment.findByIdAndDelete(req.params.comment_id,function(err){
		if(err)
		res.redirect("back");
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}else{
		res.redirect("/login");
	}
}

function checkCommentOwnership(req,res,next){
	if(req.isAuthenticated()){
		//does usr owns it
		
		Comment.findById(req.params.comment_id,function(err, foundComment){
				if(err){
					console.log(err);
					res.redirect("back");
				}
				
				else{
					//console.log(foundCamp.name);
					if(foundComment.author.id.equals(req.user._id)){
						next();
					}else{
						res.redirect("back"); //go to backpage
					}
					
			}
		});
	}else{
		res.redirect("back");
	}
}
	

module.exports = router;