import React,{useEffect,createContext,useReducer,useContext } from 'react';
import Navbar from './component/Navbar'
import "./App.css";
import {BrowserRouter,Route,useHistory} from 'react-router-dom';
import Home from "./component/screens/home";
import Login from "./component/screens/Login";
import Profile from "./component/screens/Profile";
import Signup from "./component/screens/Signup";
import CreatePost from "./component/screens/CreatePost";
import {reducer,initialState} from "./reducers/userReducer";
import UserProfile from "./component/screens/UserProfile"
import SubPost from "./component/screens/SubscribedUserPosts"
import OpenCalendar from "./component/screens/Opencalendar"
import CalendarSearch from "./component/screens/CalendarSearch"
import Chat from './component/screens/chat';
export const UserContext=createContext();

const Routing=()=>{
 const history=useHistory();
 const {state,dispatch}=useContext(UserContext);
 useEffect(()=>{
   const user=JSON.parse(localStorage.getItem("user"));
  // console.log(typeof(user));
   if(user){ 
     //history.push("/");
         dispatch({type:"USER",payload:user}); 
 }
   else history.push("/login")
 },[])
  return(
    <>
  <Route exact path="/">
    <Home />
    </Route>

     <Route path="/signup">
    <Signup />
    </Route>
     
     <Route path="/login">
    <Login />
    </Route>


    <Route path="/Opencalendar">
    <OpenCalendar />
    </Route>   
     <Route path="/SearchedPosts/:calendardate">
    <CalendarSearch />
    </Route>
    <Route exact path="/profile">
    <Profile/>
    </Route>
    <Route path="/profile/:userid">
    <UserProfile />
    </Route>
    <Route path="/create">
    <CreatePost/>
    </Route>
    <Route path="/myfollowingpost">
    <SubPost/>
    </Route>
    <Route path="/chat">
    <Chat/>
    </Route>
    </>
    );
}
function App() {
  const [state,dispatch]=useReducer(reducer,initialState);
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Navbar/>
    <Routing/>
    
     </BrowserRouter>
     </UserContext.Provider>
  );
}

export default App;
