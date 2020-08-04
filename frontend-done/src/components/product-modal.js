import React from "react";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "./css/newproduct.css";

import img1 from "assets/img/sidebar-1.jpg";
import buyed from "assets/img/buyedimage.png";
import my from "assets/img/myimage.png";

export default function Admin(props) {
  var id = sessionStorage.getItem("id");

  return (
    <div>
      <div>
        <img src = {img1} alt = '140 * 120' className = "modal-img"></img>
      </div>
      <div className = "product-modal-setting">
        <div className = "product-modal-name">{props.data.name}</div>
        <div className = "product-modal-badge">{props.data.price}</div>
        <a className = "product-modal-count" href = "/#">{props.data.quantity}</a>
      </div>
      {(()=>{
        if(id == props.data.user_id)
        {
          return(
            <img alt ='...' className = "product-modal-buyed-image" src = {my}></img>
          )
        }
        else{
          console.log(props.data);
          
          if(props.data.user_email.indexOf(id) >= 0 || props.data.quantity == 0)
          {
            return(
              <img alt ='...' className = "product-modal-buyed-image" src = {buyed}></img>
            ) 
          }
        }
      })()}
    </div>
  );
}