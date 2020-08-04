import React , {useState , useEffect} from "react";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "./css/newproduct.css";
import {connect} from "react-redux";

import GridItem from "interface/Grid/GridItem.js";
import GridContainer from "interface/Grid/GridContainer.js";
import {Link} from "react-router-dom";

import Button from '@material-ui/core/Button';
import Product_card from './product-card.js';

import Product_Modal from './product-modal.js';
import { makeStyles } from "@material-ui/core/styles";
import { useSpring, animated } from 'react-spring/web.cjs';

import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import TextField from '@material-ui/core/TextField';

import * as commentAction from "../redux/action/commentAction"

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};


function Admin(props) {

  const [name , setName] = useState("");
  const [description , setDescription] = useState("");
  const [price , setPrice] = useState("");
  const [quantity , setQuantity] = useState("");
  const [image_url , setimage_url] = useState("");

  const [product , setProduct] = useState([]);
  const [myproduct , setMyproduct] = useState([]);
  const [currentProduct , setCurrentproduct] = useState({});

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [comment, setComment] = React.useState(false);

  const handleOpen = (item) => {
    console.log(item)
    setName(item.name);
    setDescription(item.description);

    var temp_price = JSON.stringify(item.price);
    temp_price = temp_price.replace(",","");
    temp_price = temp_price.split(".")[0];
    temp_price = temp_price.split("$")[1];
    setPrice(parseInt(temp_price));

    setQuantity(item.quantity);
    setimage_url(item.image_url);
    setCurrentproduct(item)
    setOpen(true);
    props.currentComment(item);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const editOpen = (item) => {
    setEdit(true);
  };

  const editClose = () => {
    setEdit(false);
  };

  const buy = () => {
    var sendData = {
      id : currentProduct.id,
      quantity : (parseInt(currentProduct.quantity)-1),
      user_email : currentProduct.user_email += "|" + sessionStorage.getItem("id"),
    }

    fetch('http://localhost:3000/api/v1/products.json', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth' : sessionStorage.getItem('token')
      },
      body: JSON.stringify({product : sendData}),
      }).then((response) => {return response.json()})
        .then((data)=>{
          var temp = {
            id : currentProduct.id,
            quantity : (parseInt(currentProduct.quantity)-1),
            user_email : currentProduct.user_email += "|" + sessionStorage.getItem("id"),
            name : currentProduct.name,
            description : currentProduct.description,
            price : currentProduct.price,
            image_url : currentProduct.image_url,
            user_id : currentProduct.user_id,
          }
          var temp1 = product;
          temp1.push(temp);
          setProduct(temp1)
          setProduct(product.filter(item=>item !== currentProduct))
          setOpen(false)
      })
  };

  const product_delete = () => {
    fetch('http://localhost:3000/api/v1/deleteproducts.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth' : sessionStorage.getItem('token')
      },
      body : JSON.stringify({id:currentProduct.id})
      }).then((response) => {
        setMyproduct(myproduct.filter(item=>item !== currentProduct))
        setProduct(product.filter(item=>item !== currentProduct))
        setOpen(false)
      })
  };

  const product_update = () => {
    var sendData = {
      id : currentProduct.id,
      name,
      description,
      price,
      quantity,
      image_url,
      user_email : currentProduct.user_email,
      user_id : sessionStorage.getItem("id")
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
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth' : sessionStorage.getItem('token')        
      },
      body: JSON.stringify({product : sendData}),
      }).then((response) => {return response.json()})
        .then((data)=>{

          sendData.price = "$"+sendData.price;

        var temp = myproduct;
        temp.push(sendData);
        setMyproduct(temp)
        setMyproduct(myproduct.filter(item=>item !== currentProduct))
        
        var temp1 = product;
        temp1.push(sendData);
        setProduct(temp1)
        setProduct(product.filter(item=>item !== currentProduct))

        setEdit(false);
        setOpen(false);
      })
  }

  var user_id = sessionStorage.getItem("id");
  var my_email = sessionStorage.getItem("email");

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/products.json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      }).then((response) => {
        return response.json()})
      .then((data)=>{
        console.log(data);
        var temp = [];
        for(var i = 0 ; i < data.products.length; i ++)
        {
          if(user_id == data.products[i].user_id)
          {
            temp.push(data.products[i]);
          }
        }
        setProduct(data.products);
        setMyproduct(temp);
      })
    } , [])

  const Allproducts = product.map((item , index) => {
    return(
      <GridItem key={index} xs={12} sm={6} md={2} onClick={()=>handleOpen(item)} >
        <Product_card key={item.id} data = {item}></Product_card>
      </GridItem>
    )
  })
  const AllMyproducts = myproduct.map((item , index) => {
    return(
      <GridItem key={index} xs={12} sm={6} md={2} onClick={()=>handleOpen(item)} >
        <Product_card key={item.id} data = {item}></Product_card>
      </GridItem>
    )
  })

  return (
    <div>
      {(()=>{
        if(sessionStorage.getItem("id"))
        {
          return(
            <Button className = "product-first" variant="contained" color="secondary">
              <Link to="newproduct" className = "whitecolor"> New Product </Link>
            </Button>
          )
        }
      })()}
 
      {(()=>{
        if(sessionStorage.getItem("id") && myproduct.length)
        {
          return(
            <GridContainer>
              <h1> My Product </h1>
            </GridContainer>
          )
        }
      })()}
      {(()=>{
        if(sessionStorage.getItem("id"))
        {
          return(
            <GridContainer>
              {AllMyproducts}
            </GridContainer>
          )
        }
      })()}
      {(()=>{
        if(product.length)
        {
          return(
            <h1> All product </h1>
          )
        }
      })()}
      <GridContainer>
        {Allproducts}
      </GridContainer>

        <Modal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          className="modal"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <Product_Modal data = {currentProduct}></Product_Modal>
              <div className = "modal-footer">
                <Button onClick = {()=>setOpen(false)} className = "modal-button-cancel" variant="contained" color="secondary">
                  Cancel
                </Button>
                {(()=>{
                  if(user_id != currentProduct.user_id)
                  {
                    if(user_id)
                    {
                      if(currentProduct.user_email)
                      {
                        if(currentProduct.user_email.indexOf(user_id) < 0)
                        {
                          return(
                            <Button onClick = {()=>buy()} className = "modal-button-buy" variant="contained" color="primary">
                              Buy
                            </Button>
                          )
                        }
                      }
                    }
                  }
                  else{
                    return(
                      <Button onClick = {()=>product_delete()} className = "modal-button-buy" variant="contained" color="primary">
                        Delete
                      </Button>
                    )
                  }
                })()}
                {(()=>{
                  if(user_id == currentProduct.user_id)
                  {
                    return(
                      <Button onClick = {()=>setEdit(true)} className = "modal-button-buy" variant="contained" color="primary">
                        Update
                      </Button>
                    )
                  }
                })()}
                {(()=>{
                  if(user_id)
                  {
                    return(
                      <Button className = "modal-button-buy" variant="contained" color="primary">
                        <Link className = "whitecolor" to = "comment">View Comment</Link>
                      </Button>
                    )
                  }
                })()}
              </div>
            </div>
          </Fade>
        </Modal>

        <Modal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          className="modal"
          open={edit}
          onClose={editClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={edit}>
            <div className={classes.paper}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <div className='product-five'>
                    <div className='product-five-half'>
                      <TextField onChange = {(e) => setName(e.target.value)} className = "product-floatLeft product-five-textfield" defaultValue ={name} label="Product Name"/>
                    </div>
                    <div className='product-five-half'>
                      <TextField onChange = {(e) => setPrice(e.target.value)} className = "product-floatLeft product-five-textfield" defaultValue={price} min = {100} label="Product Price"/>
                    </div>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <div className='product-five'>
                    <TextField multiline onChange = {(e) => setDescription(e.target.value)} className = "product-floatLeft product-five-textfield" defaultValue={description} label="Item Description"/>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <div className='product-five'>
                    <div className='product-five-half'>
                      <TextField onChange = {(e) => setQuantity(e.target.value)} className = "product-floatLeft product-five-textfield" type="number" defaultValue={quantity} label="Item Quantity"/>
                    </div>
                    <div className='product-five-half'>
                      <TextField onChange = {(e) => setimage_url(e.target.value)} className = "product-floatLeft product-five-textfield" defaultValue={image_url} label="Image Url"/>
                    </div>
                  </div>
                </GridItem>
              </GridContainer>
              <div className = "modal-footer modal-footer-edit">
                <Button onClick = {()=>setEdit(false)} className = "modal-button-cancel" variant="contained" color="secondary">
                  Cancel
                </Button>
                <Button onClick = {()=>product_update()} className = "modal-button-buy" variant="contained" color="primary">
                  Update
                </Button>
              </div>
            </div>
          </Fade>
        </Modal>
    </div>
  );
}

export default connect(null , commentAction)(Admin);