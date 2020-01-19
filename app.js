var express =require('express');
var app=express();
var bodyParser=require('body-parser');
app.set("view engine", "ejs");

var campgrounds=[{
		name : "Tuna divine",
		image:"https://pixabay.com/get/57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c722678d39f4ac25f_340.jpg"
	},
	{
		name: "Stone dog",
		image:"https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c722678d39f4ac25f_340.jpg"
	},
	{
		name: "Goat Mountain",
		image:"https://pixabay.com/get/55e8dc404f5aab14f6da8c7dda793f7f1636dfe2564c704c722678d39f4ac25f_340.jpg"
	},
				 {
		name : "Tuna divine",
		image:"https://pixabay.com/get/57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c722678d39f4ac25f_340.jpg"
	},
	{
		name: "Stone dog",
		image:"https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c722678d39f4ac25f_340.jpg"
	},{
		name : "Tuna divine",
		image:"https://pixabay.com/get/57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c722678d39f4ac25f_340.jpg"
	},
	{
		name: "Stone dog",
		image:"https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c722678d39f4ac25f_340.jpg"
	}
					];

app.use(bodyParser.urlencoded({extended:true}));- 
// app.use(express.static("public")); 

	
app.get("/",function(req,res){
	res.render("landing");
});


app.get("/campgrounds/new",function(req,res){
	res.render("new");
	
});


app.get("/campgrounds",function(req,res){
	
	res.render("campgrounds",{
		campgrounds: campgrounds
	});
});


app.post("/campgrounds",function(req,res){
	var name=req.body.name;
	
	var image=req.body.image;
	var newCampground={
		name: name, image:image
	};
	campgrounds.push(newCampground);
	
	res.redirect("/campgrounds");
});

app.listen(3000,function(){
	console.log("connected");
})