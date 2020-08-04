import React from "react";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "./css/newproduct.css";

import Card from "interface/Card/Card.js";
import CardHeader from "interface/Card/CardHeader.js";
import Badge from '@material-ui/core/Badge';

import img1 from "assets/img/sidebar-1.jpg";
import buyed from "assets/img/buyedimage.png";
import my from "assets/img/myimage.png";

export default function Admin(props) {
  var id = sessionStorage.getItem("id");

  return (
    <Card className = "card">
      <img src = {img1} alt = '140 * 120' className = "card-img"></img>
      <CardHeader>
        <p className = "card-p"> {props.data.name} </p>
        <Badge  className = "card-badge" badgeContent={props.data.price} color="primary"></Badge>
      </CardHeader>
      <a href = "/#" > {props.data.quantity} </a>
 
      {(()=>{
        if(id == props.data.user_id)
        {
          return(
            <img alt ='...' className = "product-card-buyed-image" src = {my}></img>
          )
        }
        else{
          if(props.data.user_email.indexOf(id) >= 0 || props.data.quantity == 0)
          {
            return(
              <img alt ='...' className = "product-card-buyed-image" src = {buyed}></img>
            ) 
          }
        }
      })()}
    </Card>
  );
}