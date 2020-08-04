import React,{useState} from "react";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "./css/newproduct.css";

import GridItem from "interface/Grid/GridItem.js";
import GridContainer from "interface/Grid/GridContainer.js";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const history = require("history").createBrowserHistory();
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-za-z\-0-9]+\.)+[a-za-z]{2,}))$/;

export default function Admin() {

  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");

  const Login = () => {
    var sendData = {
      email : email ,
      password : password ,
    }
    
    if(email === "" || password === "")
    {
      alert("you have to input correctly all fields.");
      return;
    }
    if(!re.test(email))
    {
      alert("you have to input email correctly!");
    }

    fetch('http://localhost:3000/api/v1/signin.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendData),
      }).then((response) => {
        return response.json()
      })
        .then((user)=>{
          if(!user.error)
          {
            sessionStorage.setItem("token",user.token);
            sessionStorage.setItem("id",user.id);
            history.push("");
            window.location.reload();
          }
          else{
            alert("please input user information correctly")
          }
      })
  }

  return (
    <div>
      <div className = "product-second" >
        <div className = "product-third"><div className = "product-four">Sign In</div></div>
        <div className = "product-third">
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <div className='product-five'>
                <TextField onChange = {(e) => setEmail(e.target.value)} className = "product-floatLeft product-five-textfield" label="Email"/>
              </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <div className='product-five'>
                <TextField onChange = {(e) => setPassword(e.target.value)} type="password" className = "product-floatLeft product-five-textfield" label="Password"/>
              </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <Button onClick = {()=>Login()} className = "product-six" variant="contained" color="primary">
                Sign In 
              </Button>
            </GridItem>
          </GridContainer>
        </div>
      </div>

    </div>
  );
}