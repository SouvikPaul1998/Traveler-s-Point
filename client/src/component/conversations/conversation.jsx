import React,{useState,useEffect} from 'react';
import './conversation.css'
const Conversation=({conversation,currentUser})=>{
	//const [user,setUser]=useState(null)
	let url="https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGhvdG98ZW58MHx8MHx8&w=1000&q=80"
	const [friend,setFriend]=useState({})
	useEffect(()=>{
		
		const friendId=conversation.members.find((m)=> m!==currentUser._id);
		fetch("/friendDetails/"+friendId,{
			headers:{
				"Authorization":"Bearer "+localStorage.getItem('jwt')
			}
		}).then(res=>res.json())
		.then(result=>{
		//console.log("Your result is",result)
			setFriend(result)
		})
	},[conversation,currentUser])
	/*useState(()=>{
		console.log("this is the friend",friend)
	},[friend])*/
	return (
		<>
		<div className="conversation">
			<img className="conversationImg" 

			src={friend.pic}
			alt=""
			/>
			<span className="conversationName">{friend.name}</span>
		</div>
		</>
		)
}

export default Conversation;