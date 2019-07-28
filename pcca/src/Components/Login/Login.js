import React from 'react';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';
import axios from 'axios';
import './Login.module.css';
import Slider from '../Slider/Slider';
import Spinner from '../Spinner/Spinner';

 

class Login extends React.Component{
    state = {
    	res: "", 
    	user: "", 
    	username: "", 
    	password: "", 
	}

	loginDataHandler = (event) => {
        event.preventDefault();
		const data = {
			email: this.state.username,
			password: this.state.password
		};

		var login = {
			"async": true,
			"crossDomain": true,
			"url": "http://localhost:5000/userlogin",
			"method": "POST",
			"headers": {
			  "Content-Type": "application/json",
			  "Accept": "*/*",
			  "Cache-Control": "no-cache",
			  "Host": "localhost:5000",
			  "accept-encoding": "gzip, deflate",
			  "Connection": "keep-alive",
			  "cache-control": "no-cache"
			},
			"processData": false,
			"data": data
	
		  };

		  axios(login).then(response => {
			if (response.data.access_token){
			   var tok = {userID: response.data.userID, token: response.data.access_token, user: response.data.email, firstname: response.data.firstname, lastname: response.data.lastname, phone: response.data.phone };
		       this.props.loggedIn(tok);
			   this.props.history.push("/");		   

			}
			this.props.flash(response.data.message);

		  }).catch(error=> {
			//console.log(error);
		  });

	}

	render (){


		var msg = <div className="msg"> {this.props.msg.message} </div>;
	
		
		
		return (
                <div className="container">
						
						<h1 className="text-center">Login</h1>
                       
						{msg}
						<form className='LoginForm row' onSubmit={(event) => this.loginDataHandler(event)} >
						
						    <div className="col-md-6 col-md-offset-3 form-group">
								<label>Email</label>
								<input type='email'  value={this.state.username} onChange={(event)=>this.setState({username: event.target.value})} required />
							</div>
							<div className="col-md-6 col-md-offset-3 form-group">
								<label>Password</label>
								<input type='password' value={this.state.password} onChange={(event)=>this.setState({password: event.target.value})} required />	
						    </div>						
							<div className="col-md-6 col-md-offset-3 form-group text-center">
							   <button  className="btn" type="submit"> Login </button>
							</div>
						</form>

                </div>

			);
	}
}


const mapStateToProps = state => {
	return{ 
		msg: state   
	}
};


const mapDispatchToProps = dispatch =>{  
    return{
        loggedIn: (tok) => dispatch({type: actionTypes.LOGGED_IN, payload:tok}),
        flash: (msg) => dispatch({type: actionTypes.FLASH_MESSAGE, message:msg})
    
    }

};



 
export default connect(mapStateToProps,mapDispatchToProps)(Login);