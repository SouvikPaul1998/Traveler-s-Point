import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../../App';
import {useParams} from 'react-router-dom'

const Profile=()=>{
  const [userProfile,setProfile]=useState(null);
  const {state,dispatch}=useContext(UserContext);
 
  const {userid}=useParams()
  console.log(userid)
   const [showfollow,setshowFollow] =useState(state?!state.following.includes(userid):true);
  useEffect(()=>{
    fetch(`/user/${userid}`,{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json()).then(result=>{
     // console.log(typeof(result))
     // console.log("this is lit ",result.mypost[0].body)
    console.log("this is the result",result)
    setProfile(result)
    console.log("user profile",userProfile)
    //console.log(mypics)
  }
  )
  },[])

  const followUser=()=>{
    fetch('/follow',{
    method:"put",
     headers:{
             "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          followId:userid
        })
    }).then(res=>res.json())
        .then(data=>{
          console.log("the data is",data)
          dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
          localStorage.setItem("user",JSON.stringify(data))
          setProfile((prevState)=>{
            return {
              ...prevState,
              user:{
                ...prevState.user,
                followers:[...prevState.user.followers,data._id]
              }
            }
          })
          setshowFollow(false)
        })

  }

  const unfollowUser=()=>{
    fetch('/unfollow',{
    method:"put",
     headers:{
             "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          unfollowId:userid
        })
    }).then(res=>res.json())
        .then(data=>{
          console.log("the data is",data)
          dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
          localStorage.setItem("user",JSON.stringify(data))
          setProfile((prevState)=>{
            const newFollower =prevState.user.followers.filter(item=>item!=data._id)
            return {
              ...prevState,
              user:{
                ...prevState.user,
                followers:newFollower
              }
            }
          })
          setshowFollow(true)

        })

  }


	return(
    <>
    
		{userProfile? 
      <div style={{maxWidth:"550px",margin:"0px auto"}}>
           <div style={{
               display:"flex",
               justifyContent:"space-around",
               margin:"18px 0px",
               borderBottom:"1px solid grey"
           }}>
               <div>
                   <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                   src={userProfile.user.pic}
                   />
               </div>
               <div>
                   <h4>{userProfile.user.name}</h4>
                   <h5>{userProfile.user.email}</h5>
                 {console.log("the profile is",userProfile)}
                   <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                       <h6>{userProfile.posts.length} Posts</h6>
                       <h6>{userProfile.user.followers.length} followers</h6>
                       <h6>{userProfile.user.following.length} following</h6>
                   </div>
                   {showfollow?
                     <button style={{
                       margin:"10px"
                     }}className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>followUser() } >
                    Follow
                    </button>
                    :
                    <button style={{
                       margin:"10px"
                     }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>unfollowUser() } >
                    UnFollow
                    </button>
                   }
                   
                    
                   </div>
                   </div>
                   <div className="gallery">
                       {
                         userProfile.posts.map(item=>{
                           return(
                            <img className="item" src={item.photo} alt={item.body} key={item._id}/>
                            );
                         })
                       }
                   
                   
        
                   </div>
                   </div>
      :<h2>loading...</h2>}
                   </>
		)
}

export default Profile;