import React,{useEffect,useState} from 'react';
import './chatOnline.css'
//{onlineUsers, currentId ,setCurChat}
const ChatOnline=({onlineUsers, currentId, setCurrentChat })=>{
 //console.log("wertyuo user ",onlineUsers)
 let followlist=[]
 let count=0;
 const [followings,setFollowings]=useState([])
 const [onlinefollowings,setOnlinefollowings]=useState([])
 let user=JSON.parse(localStorage.getItem("user"))
 useEffect(()=>{
 fetch('/Allfriends/',{
 		"method":"Post",
 		headers:{
        "Authorization":"Bearer "+localStorage.getItem('jwt')

      },
      body:JSON.stringify({
       followings:user.following
      })
  }).then(res=>res.json())
 	.then(result=>{
 		setFollowings(result);
 	})

 },[])
 useEffect(()=>{
 	setOnlinefollowings(followings.filter((f)=> onlineUsers.includes(f._id)));
 },[followings,onlineUsers])

 const handleClick=(user)=>{
 	console.log("Online user clicked");
 	fetch("/find/"+currentId._id+"/"+user._id,{
 		 method:"get",
     headers:{
             "Content-Type":"application/json",
             "Authorization":"Bearer "+localStorage.getItem("jwt")
             }
 	}).then(res=>res.json())
 	  .then(result=>setCurrentChat(result))
 	  .catch(err=>console.log(err))
 }
 //setCurrentChat(result._id)
 //console.log("The following state",followings)
/* user.followers.map((friendId)=>{
 	fetch('/friendDetails/'+friendId,{
 		headers:{
        "Authorization":"Bearer "+localStorage.getItem('jwt')
      }
  }).then(res=>res.json())
 	.then(result=>{
 		const details={
 			friendId:result._id,
 			pic:result.pic,
 			name:result.pic
 		}
 		console.log(details)
 		followlist.push(details)
 	})

 })*/
 //console.log("the following is",user.following)
 
// console.log("Inside chatonline",user.followers)

	return (
		<div className="chatOnline">
		{onlinefollowings.map(o=>(

			<div className="chatOnlineFriend" onClick={()=> handleClick(o)}>
		<div className="chatOnlineImgContainer" >
			<img className="chatOnlineImg" 
			src={o?o.pic:"Loading"}
			alt=""
			/>
			{console.log("gygbjihuj",o)}
			<div className="chatOnlineBadge"></div>
			</div>
			<span className="chatOnlineName">{o.name}</span>
		</div>
			))}
		
		</div>
		)

}

export default ChatOnline;