import React from "react";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "./css/header.css";
import {Link} from "react-router-dom";

export default function Admin() {
  const signout = () =>
  {
    fetch('http://localhost:3000/api/v1/signout.json', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      }).then((response) => {
        sessionStorage.clear();
        window.location.reload();
      })
  }
  return (
    <div className = "header-first">
      <div className = "header-second"><Link className = "whitecolor" to = "">suitUp</Link></div>
      {(()=>{
        if(sessionStorage.getItem("id"))
        {
          return(
            <div className = "header-third">
              <div className = "header-four"><Link className = "whitecolor" to = "">Home</Link></div>
              <div onClick = {()=>signout()} className = "header-four">Sign Out</div>
            </div>
          )
        }
        else{
          return(
            <div className = "header-third">
              <div className = "header-four"><Link className = "whitecolor" to = "">Home</Link></div>
              <div className = "header-four"><Link className = "whitecolor" to = "signin">Sign In</Link></div>
              <div className = "header-four"><Link className = "whitecolor" to = "signup">Sign Up</Link></div>
            </div>
          )
        }
      })()}
    </div>
  );
}