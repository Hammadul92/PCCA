
import React from 'react';
import axios from 'axios';

class Contact extends React.Component{

	state = {
    	name: '',
    	email: '',
    	message: '',
    	response_msg: 'Testing this'
    }

	contactDataHandler = () => {
		const data = {
			email: this.state.email,
			message: this.state.message,
			name: this.state.name
		};

		var contact = {
			"async": true,
			"crossDomain": true,
			"url": "http://localhost:5000/contact",
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

		  axios(contact).then(response => {
			 this.setState({ response_msg: response.data.msg});
          }).catch(error=> {
			
		  });

	}

	render (){
		
        var response_msg = <div className="msg"> {this.state.response_msg}</div>;

		return(
				<div className="container">
				     {response_msg}
                     <h1 className="text-center"> Contact Us</h1>	
                     <div className="row LoginForm">
                        <div className="form-group col-md-6 col-md-offset-3">
                            <label> Name </label>
                        	<input type="text" value={this.state.name} onChange={(event)=>this.setState({name: event.target.value})} />
                        </div>
                        <div className="form-group col-md-6 col-md-offset-3">
                            <label>  Email </label>
                        	<input type="email" value={this.state.email} onChange={(event)=>this.setState({email: event.target.value})} />
                        </div>
                        <div className="form-group col-md-6 col-md-offset-3">
                            <label>  Message </label>
                        	<textarea style={{ height: 200 }} value={this.state.message} onChange={(event)=>this.setState({message: event.target.value})}></textarea>
                        </div>
                        <div className="form-group col-md-6 col-md-offset-3">
                           <button className="btn" onClick={this.contactDataHandler}> Contact </button>
                        </div>
                     </div>
	            </div>
			);
	}
}

export default Contact;