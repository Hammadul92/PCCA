
import Auxilary from '../../hoc/Auxilary/Auxilary';
import React from 'react';
import classes from'./Login.module.css';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';
import axios from 'axios';

 

class Login extends React.Component{
    state = {res: null, user: null, username: null , password: null, message: null}




	loginDataHandler = () => {
		const data = {
			email: this.state.username,
			password: this.state.password
		};
		console.log(data);

		var test2 = {
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

		  axios(test2)
		  .then(response => {
			//console.log(response.data.access_token);
			if (response.data.access_token){
			   this.setState({res: response.data.access_token, user: response.data.user , message: response.data.message});
			   //()=>this.loggedIn(response.data.access_token);
			   //console.log('Response has token ',response.data.user);
			}
			else{
				this.setState({ message: response.data.message});
			}
			
		  })
		  .catch(error=> {
			//console.log(error);
		  });

	}



	render (){
        //console.log('Dispatch',this.state.res)
        if (this.state.res){
			var tok = {token: this.state.res , user: this.state.user }
            this.props.loggedIn(tok);
		}
		else{
			var msg= (<p>{this.state.message} </p>);
		}
		return (
				<Auxilary>
                        <h1> Login</h1>
						{msg}

						<div className='LoginForm'>
							<lable>USERNAME</lable>
							<input type='email' aria-describedby="emailHelp" value={this.state.username} onChange={(event)=>this.setState({username: event.target.value})}/>
							<lable>Password</lable>
							<input type='password' value={this.state.password} onChange={(event)=>this.setState({password: event.target.value})}/>
							
							<button  className="btn btn-primary" onClick={this.loginDataHandler}>Login</button>
						</div>





	            </Auxilary>
			);
	}
}



const mapDispatchToProps = dispatch =>{  
   // console.log('Dispatch',dispatch)
    return{
        loggedIn: (tok) => dispatch({type: actionTypes.LOGGED_IN, payload:tok})
    
    }

};

export default connect(null,mapDispatchToProps)(Login);