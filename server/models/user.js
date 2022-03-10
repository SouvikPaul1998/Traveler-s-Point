const mongoose=require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const userschema=new mongoose.Schema({
	name:{
		type:String,
        required:true
	},
	email:{
        type:String,
        required:true
	},
	password:{
        type:String,
        required:true
    },
    pic:{
    	type:String,
    	default:"https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
	});
	mongoose.model("user",userschema);