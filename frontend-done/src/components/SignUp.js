import React , {useState} from "react";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "./css/newproduct.css";

import GridItem from "interface/Grid/GridItem.js";
import GridContainer from "interface/Grid/GridContainer.js";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";

const history = require("history").createBrowserHistory();
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-za-z\-0-9]+\.)+[a-za-z]{2,}))$/;

export default function Admin() {

  const [first_name , setFirstname] = useState("");
  const [last_name , setLastname] = useState("");
  const [email , setEmail] = useState("");
  const [venmo , setVenmo] = useState("");
  const [password , setPassword] = useState("");
  const [confirmpassword , setConfirmpassword] = useState("");
  const [image_url , setImageurl] = useState("");

  const Register = () => {
    var sendData = {
      first_name : first_name,
      last_name : last_name,
      email : email ,
      venmo : venmo,
      image_url : image_url,
      password : password ,
    }
    
    if(first_name == "" || last_name == "" || email == "" || venmo == "" || password == "" || image_url == "")
    {
      alert("you have to input correctly all fields.");
      return;
    }
    if(password !== confirmpassword)
    {
      alert("you have to input correctly password and confirmpassword!");
      return;
    }
    if(!re.test(email))
    {
      alert("you have to input email correctly!");
      return;
    }

    fetch('http://localhost:3000/api/v1/users.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user: sendData}),
      }).then((response) => {return response.json()})
        .then((user)=>{
          if(!user.error)
          {
            sessionStorage.setItem("token",user.token);
            sessionStorage.setItem("id",user.id);
            history.push("");
            window.location.reload();
          }
          else{
            alert("this is server error.")
          }
      })
  }

  return (
    <div>
      <div className = "product-second" >
        <div className = "product-third"><div className = "product-four">Sign Up</div></div>
        <div className = "product-third">
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <div className='product-five'>
                <div className='product-five-half'>
                  <TextField className = "product-floatLeft product-five-textfield" onChange = {(e) => setFirstname(e.target.value)} label="First Name"/>
                </div>
                <div className='product-five-half'>
                  <TextField className = "product-floatLeft product-five-textfield" onChange = {(e) => setLastname(e.target.value)} label="Last Name"/>
                </div>
              </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <div className='product-five'>
                <div className='product-five-half'>
                  <TextField className = "product-floatLeft product-five-textfield" onChange = {(e) => setEmail(e.target.value)} label="Email"/>
                </div>
                <div className='product-five-half'>
                  <TextField className = "product-floatLeft product-five-textfield" onChange = {(e) => setVenmo(e.target.value)} label="Venmo"/>
                </div>
              </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <div className='product-five'>
                <div className='product-five-half'>
                  <TextField className = "product-floatLeft product-five-textfield" onChange = {(e) => setPassword(e.target.value)} type="password" label="Password"/>
                </div>
                <div className='product-five-half'>
                  <TextField className = "product-floatLeft product-five-textfield" onChange = {(e) => setConfirmpassword(e.target.value)} type="password" label="Confirm Password"/>
                </div>
              </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <div className='product-five'>
                <TextField className = "product-floatLeft product-five-textfield" onChange = {(e) => setImageurl(e.target.value)} label="Image Url"/>
              </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <Button onClick = {()=>Register()} className = "product-six" variant="contained" color="primary">
                Sign Up 
              </Button>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  );
}