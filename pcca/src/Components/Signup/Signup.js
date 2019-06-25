import React from 'react';
import axios from 'axios';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';


class Signup extends React.Component{
    state = {res: null,  email: '' , password: '', phone:0, message: ''}

	SignupDataHandler = (event) => {

		event.preventDefault();
		const data = {
			email: this.state.email,
            password: this.state.password,
            phone: this.state.phone
		};

		var test = {
			"async": true,
			"crossDomain": true,
			"url": "http://localhost:5000/registration",
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
          

		  axios(test)
		  .then(response => {
			console.log(response.data.message);
			if (response.data.access_token){
			   this.setState({res: response.data.access_token , message: response.data.message});
			}
			else{
				this.setState({ message: response.data.message});
			}
			
		  })
		  .catch(error=> {
			//console.log(error);
		  });

    }


	SuccessfullSignUp=()=>{
		if (this.state.res) {
		   this.props.history.push({
			  pathname: '/login',
			  search: '?query=redirect-from-signup',
			  params: { msg: 'You have Signed Up. Please Login' }
		   })
		 }
	}



	render (){
			var msg= (<div className="msg"> {this.state.message}</div>);
			if (this.state.res){
				this.props.signedUp(this.state.message);
			}
			
			this.SuccessfullSignUp();
		
		return (
				<div className="container">
                        <h1 className="text-center"> Register </h1>
						{msg}
						<form className='LoginForm row' onSubmit={(event) => this.SignupDataHandler(event)}>
						   <div className="col-md-6 col-md-offset-3 form-group">
							<label>Email</label>
							<input type='email' required aria-describedby="emailHelp" value={this.state.email} onChange={(event)=>this.setState({email: event.target.value})} required />
						   </div>
						   <div className="col-md-6 col-md-offset-3 form-group">	
							<label>Password</label>
							<input type='password' required value={this.state.password} onChange={(event)=>this.setState({password: event.target.value})} required />
						   </div>
						   <div className="col-md-6 col-md-offset-3 form-group">
                            <label>Phone Number</label>
							<input type='tel' required value={this.state.phone} onChange={(event)=>this.setState({phone: event.target.value})} required />
						   </div>
						   <div className="col-md-6 col-md-offset-3 form-group">
							<button  type="submit" className="btn">Register</button>
						   </div>
						</form>
                </div>
			);
	}
}

const mapDispatchToProps = dispatch =>{  

    return{
        signedUp: (msg) => dispatch({type: actionTypes.SIGNED_UP, message:msg})
    
    }

};




export default connect(null,mapDispatchToProps)(Signup);