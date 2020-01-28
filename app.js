var express =require('express');
var mongoose =require('mongoose');
var passport=require('passport');
var LocalStrategy=require('passport-local');
var app=express();
var bodyParser=require('body-parser');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
var User= require("./models/user");
var Campground=require("./models/campground");
var Comment=require("./models/comment");

var seedDb=require("./seeds");

seedDb();
//PASSPORT CONFIG

app.use(require("express-session")({
	secret: "Yelp",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


 app.use(express.static(__dirname+"/public")); 
 app.use(function(req,res,next){
	 res.locals.currentUser=req.User;
	 next();
 });	
	
app.get("/",function(req,res){
	res.render("landing");
});


app.get("/campgrounds/new",function(req,res){
	res.render("campgrounds/new");
	
});


app.get("/campgrounds",function(req,res){
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

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
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
app.post("/campgrounds/:id/comments",isLoggedIn, function(req,res){
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

//auth routes


app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/campgrounds");
		});
	});
});

//login
app.get("/login",function(req,res){
	res.render("login");
});


app.post("/login",passport.authenticate("local",
 {
	 successRedirect:"/campgrounds",
  failureRedirect:"/login"
}), function(req,res){
	
});

//logout
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/campgrounds")
});

//middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}else{
		res.redirect("/login");
	}
}
app.listen(3000,function(){
	console.log("connected");
})