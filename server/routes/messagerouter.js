const express = require('express');
const router=express.Router()
const requireLogin=require("../middleware/requireLogin");
const Message=require("../models/message")

router.post("/Addmessage",requireLogin,(req,res)=>{
 const newMessage=new Message(req.body);
 newMessage.save().then(newmessage=>{
 	res.status(200).json(newmessage)
 }).catch(err=>{
 	res.status(500).json({error:err})
 })
})


router.get("/findMessages/:conversationId",requireLogin,(req,res)=>{
	Message.find({
		conversationId:req.params.conversationId
	}).then(messages=>{
		res.status(200).json(messages)
	}).catch(err=>{
		res.status(500).json({error:err})
	})
})


module.exports=router;