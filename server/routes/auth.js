const express = require('express');
const router=express.Router()
const mongoose = require('mongoose')
const bycrypt=require('bcryptjs')
const User=mongoose.model("user");
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../keys')
const requireLogin=require("../middleware/requireLogin");
const nodemailer=require('nodemailer')
const sendgridTransport=require('nodemailer-sendgrid-transport')
const {SENDGRID_API} = require('../keys')
//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

/*const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"
    }
}))*/


router.get('/protected',requireLogin,(req,res)=>{
	res.send("hello user");
})

router.post('/signup',(req,res)=>{
	//console.log(req.body.name);
	console.log("Its here");
	const {name,email,password,pic}=req.body;
	if(!email || !password || !name){
		return res.status(422).json({error:"please add all fields"})
	}
	User.findOne({email:email}).then((savedUser)=>{
		if(savedUser){
			return res.status(420).json({error:"user exists with email"})
		} 
		bycrypt.hash(password,12).then(hashedpassword=>{
			const user=new User({
			email,
			password:hashedpassword,
			name,
			pic
		})
		user.save().then(user=>{
			 /*transporter.sendMail({
                     to:user.email,
                     from:"souvikkaka0@gmail.com",
                     subject:"signup success",
                     html:"<h1>welcome to instagram</h1>"
                 })*/

			// console.log("sent")
			res.json({message:"saved successful"})
		}).catch(err=>{
		console.log(err);
	})
	}).catch(err=>{
		console.log(err);
	})

	}).catch(err=>{
		console.log(err);
	})
})

router.post('/signin',(req,res)=>{
	//console.log("here")
	const {email,password}=req.body;
	//console.log(req.body);
	if(!email || !password){
     return res.status(422).json({error:"Please enter email and password"})
	}
	User.findOne({email:email}).then(savedUser=>{
       if(!savedUser){
       return res.status(422).json({error:"invalid email or password"})
       }
       bycrypt.compare(password,savedUser.password).then(match=>{
       	if(match){
       		//res.json({message:"successfully signed in"});
       		const {_id,name,email,followers,following,pic} = savedUser;
       	const token=jwt.sign({email,_id:savedUser._id},JWT_SECRET)
       	//const {_id,name,email} =savedUser;
       	res.json({token,user:{_id,name,email,followers,following,pic}})
       	}
       	else{
       		return res.status(422).json({error:" Here invalid email or password"})
       	}
       }).catch(err=>{
       	console.log(err)
       })
	})
})
module.exports=router;