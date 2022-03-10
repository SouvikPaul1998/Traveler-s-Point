import React,{useContext,useRef,useEffect,useState} from 'react';
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../App';
import M from "materialize-css";

const Navbar =()=>{
  const searchModal=useRef(null);
  const calendar=useRef(null);
  const {state,dispatch}=useContext(UserContext);
  const history=useHistory();
  const [search,setSearch] =useState("");
  const [UserDetails,setUserDetails]=useState([]);

useEffect(()=>{
 M.Modal.init(searchModal.current);
},[])

const fetchUser=(query)=>{
  console.log("fetch user")
  setSearch(query)
  fetch('/search_user',{
    'method':'post',
    'headers':{
      'Content-Type':'application/json',
      "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    'body':JSON.stringify({
      search:query
    })
  }).then(res=>res.json())
  .then(results=>{
    setUserDetails(results.user);
    console.log(results.user);
  })
}

const openCalendar=()=>{
console.log("nope");
}
  const renderList=()=>{
    if(state) {
      return [
        <li><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
        <li><Link to="/chat">Chat</Link></li>,
      <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/create">CreatePost</Link></li>,
        <li><Link to="/myfollowingpost">My Followings Post</Link></li>,
        <li  key="5">
             <button className="btn #c62828 red darken-3"
             onClick={()=>{
               console.log("logout clicked");
               localStorage.clear();
               dispatch({type:"CLEAR"});
               history.push('/login');
             }}
              >Logout</button>
             </li>
      ]
    }

    else{
      return[
        <li><Link to="/login">Login</Link></li>,
        <li><Link to="/signup">signup</Link></li>

      ]
    }
  }
	return(
		 <nav>

    <div className="nav-wrapper white" style={{color:"black"}}>
      <a href="/" className="brand-logo left">Instagram</a>
      <ul id="nav-mobile" className="right ">
        {renderList()}
      </ul>
    </div>

    
 



    <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
    <div className="modal-content">
      <input type="text" placeholder="search by email" 
        value={search}
           onChange={(e)=>{fetchUser(e.target.value)}} />
           <div className="collection">
           <ul className="collection">
               {UserDetails.map(item=>{
                 return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                   M.Modal.getInstance(searchModal.current).close()
                   setSearch('')
                 }}><li className="collection-item">{item.email}</li></Link> 
               })}
               
              </ul>
              </div>
    </div>
    <div className="modal-footer">
      <button  className="modal-close waves-effect waves-green btn-flat">Agree</button>
      <button  className="modal-close waves-effect waves-green btn-flat">No</button>
    </div>
  </div>
  </nav>
  )
}

export default Navbar;