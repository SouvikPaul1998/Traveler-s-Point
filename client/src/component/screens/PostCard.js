import React,{useState,useEffect,useContext} from 'react';
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import './PostCard.css'
const PostCard =()=>{
return(
    <>
     <div className="row">
    <div className="col s110 m7">
      <div className="card">
        <div className="card-image">
          <img src="http://res.cloudinary.com/mynamesouvik/image/upload/v1634476217/hvbdceguoe2apnbi3kfj.jpg"/>
          <span className="card-title">Card Title</span>
        </div>
        <div className="card-content">
          <p>I am a very simple card. I am good at containing small bits of information.
          I am convenient because I require little markup to use effectively.</p>
        </div>
        <div className="card-action">
          <a href="#">This is a link</a>
        </div>
      </div>
    </div>
  </div>

    </>
	);
}

export default PostCard;
