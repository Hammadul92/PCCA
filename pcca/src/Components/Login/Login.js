
import Auxilary from '../../hoc/Auxilary/Auxilary';
import React from 'react';
import classes from'./Login.module.css';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';
import axios from 'axios';

class Login extends React.Component{
    state = {res: null}

	componentWillMount(){
		//CREATEING TOKEN//
	
		 //ACCESS A PRIVATE ROUTE
		 
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
			"data": "{\n    \"email\": \"info@pcca.com\",\n    \"password\": \"paklah92\"\n}"
	
		  };
		   axios(test2)
		   .then(response => {
			 //console.log(response.data.access_token);
			 if (response.data.access_token){
                this.setState({res: response.data.access_token});
                //()=>this.loggedIn(response.data.access_token);
				console.log('Response has token ');
			 }
			 else{
				console.log('STATE logged in');
			 }
			 
		   })
		   .catch(error=> {
			 console.log(error);
		   });
	
	
	}


	render (){
        console.log('Dispatch',this.state.res)
        if (this.state.res){
            this.props.loggedIn(this.state.res);
        }
		return (
				<Auxilary>
                        <h1> Login</h1>

	            </Auxilary>
			);
	}
}



const mapDispatchToProps = dispatch =>{  
    console.log('Dispatch',dispatch)
    return{
        loggedIn: (tok) => dispatch({type: actionTypes.LOGGED_IN, token: tok})
    
    }

};

export default connect(null,mapDispatchToProps)(Login);