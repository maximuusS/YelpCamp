var express =require('express');
var mongoose =require('mongoose');
var app=express();
var bodyParser=require('body-parser');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });

var Campground=require("./models/campground");
var Comment=require("./models/comment");

var seedDb=require("./seeds");

seedDb();

 app.use(express.static(__dirname+"/public")); 

	
app.get("/",function(req,res){
	res.render("landing");
});


app.get("/campgrounds/new",function(req,res){
	res.render("campgrounds/new");
	
});


app.get("/campgrounds",function(req,res){
	Campground.find({},function(err,campgrounds){
		if(err){
			console.log("err");
			
		}else{
			res.render("campgrounds/index",{
		campgrounds: campgrounds
	});
		}
	});
	
});


app.post("/campgrounds",function(req,res){
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

app.get("/campgrounds/:id",function(req,res){
		Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
			if(err)
				console.log("Error");
			else{
				console.log(foundCamp);
				res.render("campgrounds/show",{campground:foundCamp});
			}
		});
});


//COMMENT ROUTES

app.get("/campgrounds/:id/comments/new",function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err)
			console.log(err);
		else{
			res.render("comments/new",{
				campground:campground
			});
		}
	});
	
});
app.post("/campgrounds/:id/comments",function(req,res){
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
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+req.params.id);
				}
			});
		}
	});
});
app.listen(3000,function(){
	console.log("connected");
})