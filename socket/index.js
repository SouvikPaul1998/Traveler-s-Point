const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});
let users=[];
const addUsers=(userId,socketId)=>{
	console.log("adduser called",userId,socketId)
	!users.some((user)=>user.userId===userId)&&
	users.push({userId,socketId})
}

const removeUser=(socketId)=>{
	console.log("remove user called")
	users=users.filter((user)=>user.socketId!==socketId)
}

const getUser=(userId)=>{
	console.log("inside getusers",users,userId)
	return users.find((user)=>user.userId===userId)
}




io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");

  socket.on("addUser",(userId)=>{
  addUsers(userId,socket.id);
  console.log(users)
  io.emit("getUsers",users);
  });


  socket.on("sendMessage",({senderId,receiverId,text})=>{
  	console.log("the user,receiver,text",senderId,receiverId,text)
 const user=getUser(receiverId)
 console.log("socket  user is",users)
 io.to(user.socketId).emit("getMessage",{
 	senderId,
 	text,
 })
})


  socket.on("disconnect",()=>{
  	console.log("a user disconnected:")
  	removeUser(socket.id);
  })
})