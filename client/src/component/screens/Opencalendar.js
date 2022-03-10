import React,{useState,useEffect} from 'react';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import moment from 'moment'
import {useHistory} from 'react-router-dom';
const OpenCalendar=()=>{
	const [dateState, setDateState] = useState(new Date())
	const [data,setData]=useState([])
	const history=useHistory()
	//console.log("here"+dateState)
	useEffect(()=>{
   	console.log();
   
     
    },[dateState])

  const changeDate = (e) => {
  	setDateState(e)
  	let d=moment(e).format('DD-MM-YYYY')
  	console.log("moment of e is "+d)
  	var url_date="/SearchedPosts/"+d
  	history.push(url_date)
  	
   	fetch('/searchbydate',{
   		method:"Post",
   		headers:{
   			"Content-Type":"application/json",
   			"Authorization":"Bearer "+localStorage.getItem('jwt')
   		},
   		body:JSON.stringify({
   			memory_date:d
   		})
   	}).then(res=>res.json())
   	  .then(result=>{
   	  	/*setData(result.datepost);
   	  	console.log(typeof(data))
   	  	console.log(data)*/
   	  	localStorage.setItem("searchdate",d);
   	  	console.log(localStorage.getItem("searchdate"));
   	  })	


  }
  return (
    <>
      <Calendar 
      
      onChange={changeDate}
      />
     
    </>
		);
}
export default OpenCalendar;