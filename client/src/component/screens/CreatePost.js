import React,{useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import M from 'materialize-css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'

const CreatePost =()=>{
  const [title,setTitle] =useState("")
  const [body,setBody] =useState  ("")
  const [image,setImage] =useState  ("")
  const [url,setUrl]=useState  ("")
  const [datepicker,setdatepicker]=useState("");
  /*useEffect(()=>{
    console.log(datepicker)
    let d=(moment(new Date).format('DD/MM/YYYY'));
    console.log("jubhfjubdfcb"+d)
    //if(datepicker>d) console.log("future")
     // else console.log("past");
    //console.log("this is my tyoe "+typeof(datepicker))
  },[datepicker])*/

const history=useHistory()
useEffect(()=>{
  let pic_date=(datepicker==null)?moment(new Date()).format('DD/MM/YYYY') : moment(datepicker).format('DD/MM/YYYY')

 if(url){
    console.log("commin")
  fetch("/createpost ",{
             method:"Post",
             headers:{
                 "Content-Type":"application/json",
                 "Authorization":"Bearer "+localStorage.getItem("jwt")
             },
             body:JSON.stringify({
                 title,
                 body,
                 pic:url,
                 memory_date:pic_date
             })
         }).then(res=>res.json())
         .then(data=>{
             console.log(data);
             if(data.error){
                 M.toast({html: data.error,classes:"#b71c1c red darken-4"});
             }
             else{
                 M.toast({html:"Created Post Succesfully",classes:"#43a047 green darken-1"})
                 history.push('/')   
             }
         }).catch(err=>{
            console.log(err);
         })
}

},[url])
  const postDetails =()=>{
    const data =new FormData();
    data.append("file",image);
    data.append("upload_preset","insta-clone");
    data.append  ("cloud_name","mynamesouvik");
    fetch("https://api.cloudinary.com/v1_1/mynamesouvik/image/upload",{
      method:"post",
      body:data  
    }).then(res=>res.json())
      .then(data=>{
        console.log(data)
        setUrl(data.url)
      })
       .catch(err=>{
         console.log(err)
       })

       // console.log(url);
       //moment(new Date()).format('DD/MM/YYYY')
  }
	return (
		<div className="mycard">

		<div className="card input-field"
          style={{
          	margin:"10px auto",
          	maxWidth:"460px",
          	padding:"20px",
          	textAlign:"center",
          	margintop:"150px",
          	borderstyle: "solid",
            borderwidth: "5px"
          }}
		>
          <input type="text" placeholder="Title"
           value={title}
           onChange  ={(e)=>setTitle(e.target.value)}
          />
          <DatePicker 
          placeholderText="Memory Date"
          selected={datepicker}
          maxDate={new Date()}
          onChange={date => {
            //let d=(moment(date).format('DD/MM/YYYY'))
            setdatepicker(date);
              //console.log(d)
              
          }
          } 
        />
          <input type="text" placeholder="Body"
           value={body}
           onChange  ={(e)=>setBody(e.target.value)}
          />
          
          
        

           <div className="file-field input-field">
      <div className="btn blue darken-1">
        <span>Upload Image</span>
        <input type="file" onChange ={(e)=>setImage  (e.target.files [0])}/>
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text" />
      </div>
    </div>
    <button  className="btn blue darken-1"
    onClick={()=>postDetails()} >
                SubmitPost
            </button>
		</div>
		</div>
		)
}


export default CreatePost;