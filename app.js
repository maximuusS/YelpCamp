var express =require('express');
var mongoose =require('mongoose');
var app=express();
var bodyParser=require('body-parser');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });

//SCHEMA
var campgroundSchema= new mongoose.Schema({
	name:String,
	image:String,
	description:String
});
 var Campground=mongoose.model("Campground", campgroundSchema);


// Campground.create({
// 		name: "Stone dog",
// 		image:"https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c722678d39f4ac25f_340.jpg",
// 		description:"No cats allowed!"
// 	},function(err, campground){
// 	if(err)
// 		console.log(err);
// 	else
// 		console.log("New Camp");
// });






// var campgrounds=[{
// 		name : "Tuna divine",
// 		image:"https://pixabay.com/get/57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c722678d39f4ac25f_340.jpg"
// 	},
// 	{
// 		name: "Stone dog",
// 		image:"https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c722678d39f4ac25f_340.jpg"
// 	},
// 	{
// 		name: "Goat Mountain",
// 		image:"https://pixabay.com/get/55e8dc404f5aab14f6da8c7dda793f7f1636dfe2564c704c722678d39f4ac25f_340.jpg"
// 	},
// 				 {
// 		name : "Tuna divine",
// 		image:"https://pixabay.com/get/57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c722678d39f4ac25f_340.jpg"
// 	},
// 	{
// 		name: "Stone dog",
// 		image:"https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c722678d39f4ac25f_340.jpg"
// 	},{
// 		name : "Tuna divine",
// 		image:"https://pixabay.com/get/57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c722678d39f4ac25f_340.jpg"
// 	},
// 	{
// 		name: "Stone dog",
// 		image:"https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c722678d39f4ac25f_340.jpg"
// 	}
// 					];


// app.use(express.static("public")); 

	
app.get("/",function(req,res){
	res.render("landing");
});


app.get("/campgrounds/new",function(req,res){
	res.render("new");
	
});


app.get("/campgrounds",function(req,res){
	Campground.find({},function(err,campgrounds){
		if(err){
			console.log("err");
			
		}else{
			res.render("index",{
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
		Campground.findById(req.params.id,function(err,foundCamp){
			if(err)
				console.log("Error");
			else
				res.render("show",{campground:foundCamp});
		});
});

app.listen(3000,function(){
	console.log("connected");
})