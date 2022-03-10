const express = require('express');
const router=express.Router()
const requireLogin=require("../middleware/requireLogin");
const Conversation=require("../models/conversations")

router.post("/saveconversation",requireLogin,(req,res)=>{
	const newConversation=new Conversation({
		members:[req.body.senderId,req.body.receiverId]
	});
	newConversation.save().then(newConversation=>{
		res.status(200).json(newConversation)
	}).catch(err=>{
		res.json({error:err});
	})
})
router.get("/findConversation/:userId",requireLogin,(req,res)=>{
	Conversation.find({
		members:{$in: [req.params.userId]}
	}).then(conversation=>{
		res.status(200).json(conversation)
	}).catch(err=>{
		res.status(500).json({error:err});
	})
})
router.get("/find/:user1/:user2",requireLogin,(req,res)=>{
	Conversation.findOne({
		members:{$all:[req.params.user1,req.params.user2]}
	}).then(conversation=>{
		res.status(200).json(conversation)
	}).catch(err=>{
		res.status(500).json(err)
	})
})

module.exports=router;
