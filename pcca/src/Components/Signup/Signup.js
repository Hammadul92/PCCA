import React from 'react';
import axios from 'axios';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';


class Signup extends React.Component{
    state = {
      res: null, 
      firstname: '',
      lastname: '',
      email: '', 
      password: '',
      phone:'', 
      message: ''
    }

	SignupDataHandler = (event) => {

		event.preventDefault();
		const data = {
			email: this.state.email,
            password: this.state.password,
            phone: this.state.phone,
            firstname: this.state.firstname,
            lastname: this.state.lastname
		};

		var Resgistration = {
			"async": true,
			"crossDomain": true,
			"url": "https://www.pakcan.com/api/registration",
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
          

		  axios(Resgistration).then(response => {
			if (response.data.access_token){
			   this.setState({res: response.data.access_token , message: response.data.message});
			}
			else{
				this.setState({ message: response.data.message});
			}
			
		  }).catch(error=> {
			//console.log(error);
		  });

    }


	SuccessfullSignUp=()=>{

		if (this.state.res) {
		   this.props.flash(this.state.message);
		   this.props.history.push({
			  pathname: '/login',
			  search: '?query=redirect-from-signup',
			  params: { msg: 'You have Signed Up Successfully. Please Login' }
		   })
		 }
	}



	render (){
			var msg= (<div className="msg"> {this.state.message}</div>);
			
			this.SuccessfullSignUp();

			  
		
		return (
				<div className="container">
                        <h1 className="text-center"> Register </h1>
						{msg}
						<form className='LoginForm row' onSubmit={(event) => this.SignupDataHandler(event)}>
						   <div className="col-md-6 col-md-offset-3">
                           		<div className="row">
								   <div className="col-md-6 form-group">
									<label> First Name *</label>
									<input type='text' required  value={this.state.firstname} onChange={(event)=>this.setState({firstname: event.target.value})} required />
								   </div>
								   <div className="col-md-6 form-group">
									<label> Last Name *</label>
									<input type='text' required  value={this.state.lastname} onChange={(event)=>this.setState({lastname: event.target.value})} required />
								   </div>

								   <div className="col-md-6 form-group">
									<label>Email *</label>
									<input type='email' required aria-describedby="emailHelp" value={this.state.email} onChange={(event)=>this.setState({email: event.target.value})} required />
								   </div>
								   <div className="col-md-6 form-group">	
									<label>Password *</label>
									<input type='password' required value={this.state.password} onChange={(event)=>this.setState({password: event.target.value})} required />
								   </div>
								   <div className="col-md-12 form-group">
		                            <label>Phone Number *</label>
									<input type='tel' required value={this.state.phone} onChange={(event)=>this.setState({phone: event.target.value})} required />
								   </div>
                                   <div className="col-md-12">
								       <div className="checkbox">                                   
		                                  <input type="checkbox" id="consent" name="consent"/>
		                                  <label for="consent"> &nbsp;&nbsp; Accept Terms & Agreements, Community News & Events NewsLetter </label>
		                              </div>
                                   </div>

								   <div className="col-md-4 col-md-offset-4 form-group ">
									<button  type="submit" className="btn">Register</button>
								   </div>

								</div>
						   </div>
						</form>
                </div>
			);
	}
}

const mapDispatchToProps = dispatch =>{  

    return{
        flash: (msg) => dispatch({type: actionTypes.FLASH_MESSAGE, message:msg})
    
    }

};




export default connect(null,mapDispatchToProps)(Signup);