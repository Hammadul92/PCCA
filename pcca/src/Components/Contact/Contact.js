
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

class Contact extends React.Component{

	state = {
    	name: '',
    	email: '',
    	message: '',
    	flash:''
    }

	contactDataHandler = (event) => {
		event.preventDefault();
		const data = {
			email: this.state.email,
			message: this.state.message,
			name: this.state.name
		};

		var contact = {
			"async": true,
			"crossDomain": true,
			"url": "http://68.183.207.29:5000:5000/contact",
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
		  	let msg = response.data.msg;
		  	this.setState({flash: msg });
          }).catch(error=> {
			
		  });

	}

	render (){
		let msg = '';
		if(this.state.flash !== ''){

			 msg = <div className="msg"> {this.state.flash}</div>;
		}
        

		return(
				<form className="container" onSubmit={(event) => this.contactDataHandler(event)}>
                     <h1 className="text-center"> Contact Us</h1>	
                     {msg}
                     <div className="row LoginForm">
                        <div className="form-group col-md-6 col-md-offset-3">
                            <label> Name </label>
                        	<input type="text" value={this.state.name} onChange={(event)=>this.setState({name: event.target.value})} required placeholder="e.g. John Doe"/>
                        </div>
                        <div className="form-group col-md-6 col-md-offset-3">
                            <label>  Email </label>
                        	<input type="email" value={this.state.email} onChange={(event)=>this.setState({email: event.target.value})} required  placeholder="example@example.com" />
                        </div>
                        <div className="form-group col-md-6 col-md-offset-3">
                            <label>  Message </label>
                        	<textarea style={{ height: 200 }} value={this.state.message} onChange={(event)=>this.setState({message: event.target.value})}  placeholder="Please type your message here" >  </textarea>
                        </div>
                        <div className="form-group col-md-6 col-md-offset-3">
                           <button type="submit" className="btn"> Contact </button>
                        </div>
                     </div>
	            </form>
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