const express = require('express');
const router=express.Router()
//const user=require('../models/user')
const mongoose = require('mongoose')
const requireLogin=require('../middleware/requireLogin');
const Post =mongoose.model("Post")
const User =mongoose.model("user")



router.get('/user/:id',requireLogin,(req,res)=>{
	
	User.findOne({_id:req.params.id})
		.select("-password")
		.then(user=>{

			Post.find({postedBy:req.params.id})
			.populate("postedBy","_id name")
			.exec((err,posts)=>{
				if(err){
					return res.status(422).json({error:err})
				}
				
				res.json({user,posts})
			})
		}).catch(err=>{
			return res.status(404).json({error:"User not found"})
		})
})
router.get('/friendDetails/:id',requireLogin,(req,res)=>{
	User.findOne({_id:req.params.id})
		.select("-password")
		.then(user=>{
			res.status(200).json(user)
		}).catch(err=>{
			res.send(500).json({error:err})
		})
})

router.post("/Allfriends",requireLogin,async(req,res)=>{
	let followings=req.user.following;

	const friends= await Promise.all(
		followings.map((followId)=>{
			return User.find({_id:followId});
		})
	)
	let followingdata=[]
	friends.map((follow)=>{
		//console.log(follow[0])
		const { pic,_id, email, name} =follow[0];
		//console.log({ pic,_id, email, name})
		followingdata.push({ pic,_id, email, name})
	})
	//console.log(req.user)
	/*const data=req.user.following.map((followId)=>{
		let ans= User.find({_id:followId}).then(user=>{
			const { pic,_id, email, name}=user[0];
			return { pic,_id, email, name};
			//followings.push({ pic,_id, email, name})
			//console.log(followings)
			//user[0].pic,user[0]._id,user[0].email, user[0].name
			//console.log({ pic,_id, email, name})
		}).catch(error=>{
			res.status(500).json(err);
		})
		//console.log(ans)
	})*/
	//console.log("whooop data",data)
	console.log(followingdata)
	res.status(200).json(followingdata);
})

router.put('/follow',requireLogin,(req,res)=>{
	User.findByIdAndUpdate(req.body.followId,{
		$push:{followers:req.user._id}
	},{new:true},(err,result)=>{
		if(err){
			return res.status(422).json({error:err})
		}
		console.log(result)
		User.findByIdAndUpdate(req.user._id,{
			$push:{following:req.body.followId}
			},{new:true}).select("-password").then(result=>{
				console.log(result)
				res.json(result)
			}).catch(err=>{
				return res.status(422).json({error:err})
			})
	})
})

router.put('/unfollow',requireLogin,(req,res)=>{
	User.findByIdAndUpdate(req.body.unfollowId,{
		$pull:{followers:req.user._id}
	},{new:true},(err,result)=>{
		if(err){
			return res.status(422).json({error:err})
		}
		User.findByIdAndUpdate(req.user._id,{
			$pull:{following:req.body.unfollowId}
			},{new:true}).select("-password").then(result=>{
				console.log("unfollow result",result)
				res.json(result)
			}).catch(err=>{
				return res.status(422).json({error:err})
			})
	})
})

router.put('/updatepic',requireLogin,(req,res)=>{
	User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
		(err,result)=>{
			if(err){
				return res.status(422).json({error:"pic cannot post"})
			}
			console.log(result)
			res.json(result)
		})
})

router.post('/search_user',requireLogin,(req,res)=>{
	console.log("in search")
	let userPattern = new RegExp("^"+req.body.search);
	User.find({email:{$regex:userPattern}})
	.select("_id email")
	.then(user=>{
		res.json({user})
	}).catch(err=>{
		console.log(err);
	})
})

module.exports=router