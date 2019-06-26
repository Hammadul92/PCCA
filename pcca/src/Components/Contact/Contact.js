
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

class Contact extends React.Component{

	state = {
    	name: '',
    	email: '',
    	message: ''
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
			 this.props.flash(response.data.msg);
			 console.log(this.props.state.message)
          }).catch(error=> {
			
		  });

	}

	render (){
		
        var msg = <div className="msg"> {this.props.state.message}</div>;

		return(
				<div className="container">
                     <h1 className="text-center"> Contact Us</h1>	
                     {msg}
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


const mapStateToProps = state => {
	return{ 
		state: state   
	}
  };

const mapDispatchToProps = dispatch =>{  

    return{
        flash: (msg) => dispatch({type: actionTypes.FLASH_MESSAGE, message:msg})
    
    }

};


export default connect(mapStateToProps,mapDispatchToProps)(Contact);