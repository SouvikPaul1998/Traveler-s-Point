const express = require('express');
const router=express.Router()
const user=require('../models/user')
const mongoose = require('mongoose')
const Post =mongoose.model("Post")
const requireLogin=require('../middleware/requireLogin');
const User =mongoose.model("user")



router.get('/allpost',requireLogin,(req,res)=>{
	Post.find().populate("postedBy","_id name")
	.populate("comments.postedBy","_id name")			
	.then(posts=>{
		res.json({posts})
	}).catch(err=>{
		console.log(err);
	})
})


router.get('/getsubpost',requireLogin,(req,res)=>{
	Post.find({postedBy:{$in:req.user.following}})
	.populate("postedBy","_id name")
	.populate("comments.postedBy","_id name")			
	.then(posts=>{
		res.json({posts})
	}).catch(err=>{
		console.log(err);
	})
})

router.post('/createpost',requireLogin,(req,res)=>{

	const {title,body,pic,memory_date}=req.body;
	if(!title || !body || !pic){

		
		return res.status(422).json({error:"Please fill all fields"});
	}
	req.user.password=undefined;
		const post= new Post({
			title,
			body,
			photo:pic,
			memory_date,
			postedBy:req.user
		})
		post.save().then(result=>{
			res.json({post:result});
		}).catch(err=>{
			console.log(err);
		})
})

router.get('/mypost',requireLogin,(req,res)=>{
	Post.find({postedBy:req.user._id})
	.populate("postedBy","_id name")
	.then(mypost=>{
		res.json({mypost})
	}).catch(err=>{
		console.log(err)

	})
})

router.post('/searchbydate',requireLogin,(req,res)=>{
	console.log("ha ha ha pay je hasi",req.body)
	Post.find({memory_date:req.body.memory_date})
	.then(datepost=>{
		console.log(typeof(datepost))
		res.json({datepost})
	}).catch(err=>{
		console.log(err)
	})
})


router.put('/like',requireLogin,(req,res)=>{
	//console.log("hum yarar")
	//console.log("from likeees",req.body.postId);
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
        	//console.log("yaam hain hum");
            return res.status(422).json({error:err})
        }else{
        	//console.log("hum hain yam",req.body.postId);
            res.json(result)
        }
    })
})

router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})


router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
        	console.log("hell hell")
            return res.status(422).json({error:err})
        }else{
        	console.log("hell yeah")
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
	console.log("the post id is ",req.params.postId)
	Post.findOne({_id:req.params.postId})
	.populate("postedBy","_id")
	.exec((err,post)=>{
		if(err || !post){
			return res.status(422).json({error:err})
		}
		if(post.postedBy._id.toString()===req.user._id.toString	()){
			post.remove()
			.then(result=>{
				console.log(result)
				res.json(result)
			}).catch(err=>{
				console.log(err)
			})
		}
	})
})

module.exports=router