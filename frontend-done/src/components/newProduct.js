import React , {useState} from "react";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "./css/newproduct.css";

import Button from '@material-ui/core/Button';
import GridItem from "interface/Grid/GridItem.js";
import GridContainer from "interface/Grid/GridContainer.js";

import TextField from '@material-ui/core/TextField';
const history = require("history").createBrowserHistory();

export default function Admin() {

  const [name , setName] = useState("");
  const [description , setDescription] = useState("");
  const [price , setPrice] = useState("");
  const [quantity , setQuantity] = useState("");
  const [image_url , setimage_url] = useState("");

  const NewProduct = () => {

    var sendData = {
      name,
      description,
      price,
      quantity,
      image_url,
      user_id : sessionStorage.getItem("id"),
      user_email : "0"
    }
    
    if(!sessionStorage.getItem("id"))
    {
      alert("first, you need to login.");
      return;
    }

    if(name === "" || description === "" || price === "" || quantity === "" || image_url === "")
    {
      alert("you have to input correctly all fields.");
      return;
    }
    if(parseInt(price) < 100)
    {
      alert("you have to input big price than 100$!");
      return;
    }

    fetch('http://localhost:3000/api/v1/products.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth' : sessionStorage.getItem('token')
      },
      body: JSON.stringify({product : sendData}),
      }).then((response) => {return response.json()})
        .then((product)=>{
        setName("");
        setDescription("");
        setPrice("");
        setQuantity("");
        setimage_url("");
        history.push("/#/allproduct");
        window.location.reload();
      })
  }


  return (
    <div>
      <Button className = "product-first" variant="contained" color="secondary">
        All Product
      </Button>
      <div className = "product-second" >
        <div className = "product-third"><div className = "product-four">Add new Product</div></div>
        <div className = "product-third">
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <div className='product-five'>
                <div className='product-five-half'>
                  <TextField onChange = {(e) => setName(e.target.value)} className = "product-floatLeft product-five-textfield" label="Product Name"/>
                </div>
                <div className='product-five-half'>
                  <TextField type = "number" onChange = {(e) => setPrice(e.target.value)} className = "product-floatLeft product-five-textfield" min = {100} label="Product Price"/>
                </div>
              </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <div className='product-five'>
                <TextField multiline onChange = {(e) => setDescription(e.target.value)} className = "product-floatLeft product-five-textfield" label="Item Description"/>
              </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <div className='product-five'>
                <div className='product-five-half'>
                  <TextField onChange = {(e) => setQuantity(e.target.value)} className = "product-floatLeft product-five-textfield" type="number" label="Item Quantity"/>
                </div>
                <div className='product-five-half'>
                  <TextField onChange = {(e) => setimage_url(e.target.value)} className = "product-floatLeft product-five-textfield" label="Image Url"/>
                </div>
              </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <Button onClick = {()=>NewProduct()} className = "product-six" variant="contained" color="primary">
                Create Product
              </Button>
            </GridItem>
          </GridContainer>
        </div>
      </div>

    </div>
  );
}