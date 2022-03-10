import React,{useState,useEffect} from 'react';
import {useHistory,useParams} from 'react-router-dom';
import moment from 'moment'

const CalendarSearch=()=>{
   let {calendardate}=useParams()
   //let d=moment(calendardate).format('DD/MM/YYYY')
   const [data,setData]=useState([]);
   let d=""
   for(let i=0;i<calendardate.length;i++){
   	  if(calendardate[i]=="-") d+="/"
   	  else d+=calendardate[i]
   }
   console.log("The d is "+d)
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
   	  	//localStorage.setItem("searchdate",d);
   	  	console.log("hy hy usestate")
   	  	console.log(result);
   	  	setData(result)
   	  })	
	return(
		<>
		</>
    
		)
}

export default CalendarSearch;
