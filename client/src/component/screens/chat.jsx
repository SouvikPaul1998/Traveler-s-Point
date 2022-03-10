import './chat.css'
import React,{useEffect,useState,useRef,useContext } from 'react'
import Conversation from '../conversations/conversation.jsx';
import Message from '../conversations/message.jsx';
import{io} from "socket.io-client"
import ChatOnline from '../conversations/chatOnline.jsx';
import {UserContext} from '../../App';

const Chat=()=>{
  const [conversations,setConversations]=useState([]);
  const[curChat,setCurChat]=useState(null)
  const[curMessages,setCurMessages]=useState([])
  const [newMessage,setNewMessage]=useState("")
  const [arrivalMessage,setArrivalMessage]=useState(null)
  const [onlineusers,setOnlineusers]=useState([])
  const [filterConversation,setFilterConversation] = useState("")
 // const [socket,setSocket]=useState(null)
 const socket= useRef()
 const {state,dispatch}=useContext(UserContext);
  useEffect(()=>{
   socket.current= io("ws://localhost:8900")
   socket.current.on("getMessage",(data)=>{
     setArrivalMessage({
       sender:data.senderId,
       text:data.text,
       createdAt:Date.now()
     })
   })
  },[])
  let filterchat=[]
  const prefix=(str,word)=>{
    return str.lastIndexOf(word,0)===0;
  }

  useEffect(()=>{
    console.log("in filter")
   if(filterConversation!=""){
     filterchat=conversations.filter(name=>{
     // name.startsWith(filterConversation)
      console.log(name)

     })
     console.log("the filtered result is",filterchat)
   }
  },[filterConversation])
  //console.log(socket)
  const fetchconversations=(query)=>{
     console.log("query is ==== ",query)
     setFilterConversation(query)
  }

  useEffect(() => {
    arrivalMessage &&
      curChat?.members.includes(arrivalMessage.sender) &&
      setCurMessages((prev) => [...prev, arrivalMessage]);
      console.log("agaaaainnnnnnn",curChat)
  }, [arrivalMessage, curChat]);

  const scrollRef=useRef()
  let user=JSON.parse(localStorage.getItem("user"))
	//console.log(user)
 useEffect(()=>{
   //console.log("efore coected")
   //console.log(state)
   socket.current.emit("addUser",user._id)
   socket.current.on("getUsers",(users)=>{
    // console.log("coected")
     //console.log("socket users are",users)
     setOnlineusers(
       user.following.filter((f)=> users.some((u)=> u.userId === f)));
     //console.log(socket)
   })
 },[state])


  useEffect(()=>{
    fetch("/findConversation/"+user._id,{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem('jwt')
      }
    }).then(res=>res.json())
    .then(result=>{
      setConversations(result) 
      
    }).catch(err=>console.log(err))
  },[user._id])

  useEffect(()=>{
   
   if(curChat){
   //console.log("tyhis is yopur id",curChat._id)
   fetch('/findMessages/'+curChat._id,{
     headers:{
        "Authorization":"Bearer "+localStorage.getItem('jwt')
      }
    }).then(res=>res.json())
      .then(result=>{
       // console.log("we are firing 2")
        setCurMessages(result)

      }).catch(err=>console.log(err))     
 }
  },[curChat])
  //console.log("Your current chat is",curChat)
  //console.log("The message is",curMessages[0])
  const handleSubmit=(e)=>{
    e.preventDefault();
   // console.log("user id is",user._id)
   // console.log("current cono is",curChat._id)
   const receiverId=curChat.members.find(member=>member!==user._id);
   console.log("the user id is",user._id)
   socket.current.emit("sendMessage",{
     senderId:user._id,
     receiverId,
     text:newMessage
   })
   fetch("/Addmessage",{
     method:"Post",
     headers:{
             "Content-Type":"application/json",
             "Authorization":"Bearer "+localStorage.getItem("jwt")
             },
     body:JSON.stringify({
        conversationId:curChat._id,
        sender:user._id,
        text:newMessage
             })
   }).then(res=>res.json())
   .then(result=>{
     setCurMessages([...curMessages,result])
     setNewMessage("")
   })
   .catch(err=>{
     console.log(err)
   })
  }

  useEffect(()=>{
    scrollRef.current?scrollRef.current.scrollIntoView({ behavior: "smooth" }):console.log("scrooll ref not")
  },[curMessages])

	return(
	<>
	
	<div className="messenger">        
		 <div className="chatMenu" >
        	<div className="chatMenuWrapper">
        		<input placeholder="Search people" className="chatMenuInput" 
            onChange={(e)=>{fetchconversations(e.target.value)}}
            />
          
        		 {conversations.map((c)=>(
             
               <div onClick={()=>setCurChat(c) }>
               
               
              <Conversation conversation={c} currentUser={user}/>     
              </div>      ))}

        	</div>

         </div>
          <div className="chatBox">
          	 
            <div className="chatBoxWrapper" >
            {curChat?
              <>
          	   <div className="chatBoxTop">
               {
                 curMessages.map(m=>(
                   <div ref={scrollRef}>
                   <Message message={m} own={m.sender===user._id}/>
                   </div>
                 ))
               }
          	   	 
          	   	
          	   </div>   
          	   <div className="chatBoxBottom">
          	   <textarea className="chatMessageInput"
               placeholder="write something..."
               onChange={(e)=>setNewMessage(e.target.value)}
               value={newMessage}></textarea>
          	   <button className="chatSubmitButton"
               
               onClick={handleSubmit}>Send</button>
            	   </div>
                 </>: <span className="noConversationText">Open a conversation to start a chat</span>
               }
               </div>
          </div>
          {console.log("this are the onlineee ",filterConversation)}
          <div className="chatOnline" >
          	 <div className="chatOnlineWrapper">
          	  <ChatOnline onlineUsers={onlineusers} currentId={user} setCurrentChat={setCurChat}/>
          	  
          	 </div>
          </div>
          </div>

	</>
	);
  //onlineUsers={onlineusers} currentId={user._id}
  //            setCurChat={setCurChat}
}

export default Chat;