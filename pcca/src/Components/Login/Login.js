import React from 'react';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';
import axios from 'axios';

 

class Login extends React.Component{
    state = {
    	res: "", 
    	user: "", 
    	username: "", 
    	password: "", 
    	message: ""
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
			   this.setState({res: response.data.access_token, user: response.data.email, message: response.data.message});
			}else{
				this.setState({ message: response.data.message});
			}
		  }).catch(error=> {
			//console.log(error);
		  });

	}

	SuccessfullLogin=()=>{
		if (this.props.loggedIn) {
			this.props.history.push("/");
		  }

	}


	render (){

        if (this.state.res){
			var tok = {token: this.state.res, user: this.state.user , message: this.state.message}
			this.props.loggedIn(tok);
			this.SuccessfullLogin();

		}
		
		var msg = <div className="msg"> {this.state.message}</div> ;
		if (this.props.pmsg.message){
			msg = <div className="msg">Congratulations! {this.props.pmsg.message}</div>
		}
		

		
		
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
		pmsg: state   
	}
  };


const mapDispatchToProps = dispatch =>{  
    return{
        loggedIn: (tok) => dispatch({type: actionTypes.LOGGED_IN, payload:tok})
    
    }

};



 
export default connect(mapStateToProps,mapDispatchToProps)(Login);