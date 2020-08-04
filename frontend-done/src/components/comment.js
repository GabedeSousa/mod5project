import React , {useState , useEffect} from "react";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "./css/comment.css";
import {connect} from "react-redux";

import Card from "interface/Card/Card.js";
import CardHeader from "interface/Card/CardHeader.js";
import CardBody from "interface/Card/CardBody.js";
import Badge from '@material-ui/core/Badge';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import img1 from "assets/img/sidebar-1.jpg";

import * as commentAction from "../redux/action/commentAction"
const history = require("history").createBrowserHistory();

function Admin(props) {

	const [commentBody , setCommentbody] = useState("");
	const [allComments , setAllcomments] = useState([]);

	const cComment = props.cComment;

	if(!cComment)
	{
		history.push("/#/allproduct");
		window.location.reload();
	}

	useEffect(() => {
	    fetch('http://localhost:3000/api/v1/getcomments.json', {
	    method: 'POST',
	    headers: {
	    	'Content-Type': 'application/json',
	        'auth' : sessionStorage.getItem('token')
	    },
		body: JSON.stringify({id : cComment.id}),
      }).then((response) => {return response.json()})
        .then((data)=>{
        	var temp = data.comments;
        	var temp1 = [];
        	for (var i = temp.length - 1; i >= 0; i--) {
        		temp1.push(temp[i]);
        	}
        	setAllcomments(temp1);
	    })
	} , [])


	const commentsave = () => {
		var id = sessionStorage.getItem("id");
		if(!id)
		{
			alert("first you have to login.")
			return;
		}
		var sendData = {
			user_id : sessionStorage.getItem("id"),
			product_id : cComment.id,
			body : commentBody
		}
		fetch('http://localhost:3000/api/v1/comments.json', {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/json',
	        'auth' : sessionStorage.getItem('token')
	      },
	      body: JSON.stringify({comment : sendData}),
	      }).then((response) => {return response.json()})
	        .then((comment)=>{
    			history.push("/#/allproduct");
				window.location.reload();
	      })
	}

	const AllcommentMap = allComments.map((item , index) => {
	    return(
		    <Card key = {item.id} className = "card">
		        <CardBody>
				    <div className ="card-edit-six">
				    	<h4>{item.email}</h4>
				        <p>
				        	{item.body}
				        </p>
				    </div>
	        	</CardBody>
			</Card>
	    )
	})

 	return (
	    <div style = {{overflow : 'atuo'}}>
		    <Card className = "card">
		        <CardBody>
		        	<div className = "edit-card-first">
				    	<img className = "edit-card-second" src = {img1} alt = '140 * 120'></img>
		        	</div>
				    <div className = "edit-card-third">
				    	<h4>{cComment.name}</h4>
				        <Badge className="edit-card-four" badgeContent={cComment.price} color="primary"></Badge>
				        <p>{cComment.description}</p>
				    </div>
			        <a className = "edit-card-five" href = "/#" > {'quantity : ' + cComment.quantity} </a>
	        	</CardBody>
			</Card>

			{AllcommentMap}

		    <Card className = "card">
		    	<CardHeader>
		    		New Comment
		    	</CardHeader>
		        <CardBody className = "card-edit-seven">
	                <TextField onChange = {(e) => setCommentbody(e.target.value)} className = "card-edit-eight" multiline label="Comment Body"/>
	                <Button onClick = {()=>commentsave()} className = "card-edit-nine" variant="contained" color="primary">
	                	Send Comment
	            	</Button>
	        	</CardBody>
			</Card>
	    </div>
 	);
}

const getData = state => ({
	cComment : state.reducer.cComment
})

export default connect(getData , commentAction)(Admin);