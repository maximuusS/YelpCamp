var mongoose =require("mongoose");
var Campground= require("./models/campground");
var Comment=require("./models/comment");
var data=[
	{
		name:"Cloud rest",
		image:"https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description:"agag"
	},
	{
		name:"Cloud active",
		image:"https://images.unsplash.com/photo-1497906539264-eb74442e37a9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description:"ggG"
		
	},
	{
		name:"Cloud SLEEP",
		image:"https://images.unsplash.com/photo-1497906539264-eb74442e37a9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description:"agaafag"
	}
];

function seedDb(){
	
	//Remoe all campgrounds
		Campground.deleteMany({},function(err){
		if(err)
			console.log(err);
		console.log("Removed campgrounds");
			
		// 	//add few campgrounds
		// data.forEach(function(seed){
		// 	Campground.create(seed,function(err,campground){
		// 		if(err)
		// 			console.log(err)
		// 		else
		// 			console.log("Added");
		// 		//create comment
		// 		Comment.create({
		// 			text:"This place is great",
		// 			author:"Homer"
		// 		},function(err, commen){
		// 			if(err)
		// 				console.log(err);
		// 			else
		// 				campground.comments.push(commen);
		// 				campground.save();
		// 				console.log("comment added");
				
		// 		});
		// 	});
			
		// });
	});
	
}
module.exports=seedDb;