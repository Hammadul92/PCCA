
import Auxilary from '../../hoc/Auxilary/Auxilary';
import React from 'react';
import axios from 'axios';

 

class Signup extends React.Component{
    state = {res: null,  email: null , password: null, phone:null, message: null}




	SignupDataHandler = () => {
		const data = {
			email: this.state.email,
            password: this.state.password,
            phone: this.state.phone
		};
		console.log(data);
        if (data.email && data.password && data.phone){
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
          
          console.log(test.url);

		  axios(test)
		  .then(response => {
			console.log(response.data.message);
			if (response.data.access_token){
			   this.setState({res: response.data.access_token , message: response.data.message});
			   
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
    else {
        this.setState({message: 'Please Fill all the fields'});
    }
    


}



	render (){
			var msg= (<p>{this.state.message} </p>);
		
		return (
				<Auxilary>
                        <h1> Registeration</h1>
						{msg}

						<div className='signupform'>
							<lable>USERNAME</lable>
							<input type='email' required aria-describedby="emailHelp" value={this.state.email} onChange={(event)=>this.setState({email: event.target.value})}/>
							<lable>Password</lable>
							<input type='password' required value={this.state.password} onChange={(event)=>this.setState({password: event.target.value})}/>
                            <lable>Phone Number</lable>
							<input type='tel' required value={this.state.phone} onChange={(event)=>this.setState({phone: event.target.value})}/>
							
							<button  className="btn btn-primary" onClick={this.SignupDataHandler}>Register</button>
						</div>





	            </Auxilary>
			);
	}
}





export default (Signup);