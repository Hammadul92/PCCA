import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import CheckoutForm from './Checkout';
import {Elements, StripeProvider} from 'react-stripe-elements';
import './Cart.module.css';

class Proceed extends React.Component{

   state = {
       firstname: this.props.state.firstname,
       lastname: this.props.state.lastname,
       phone: this.props.state.phone,
       user: this.props.state.user,
       password: ''
    }

    FormHandler = (event) => {
        event.preventDefault();
        const data = {
          email: this.state.user,
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          phone: this.state.phone,
          password: this.state.password
        };  

        var request = {
              "async": true,
              "crossDomain": true,
              "url": "http://localhost:5000/anonymous_account",
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

          axios(request).then(response => {
           this.props.flash(response.data.message);
           this.props.updated(data);
          }).catch(error=> {});
    }

 
	render (){
        let total = 0;
        let subtotal = 0;
        let gst = 0;
        let checkout = false;
        let password_field = null;
        let usr = this.props.state.userID;
        let token = this.props.state.token;
        let tickets = this.props.state.tickets;
        let msg = <div className="msg"> {this.props.state.message}</div>;

        
        if(this.props.state.loggedin){
           checkout = true
        }
        else{
          password_field = (
             <div className="form-group">
                 <div className="col-md-12">
                    <h3>Create Account</h3>
                    <hr/>
                 </div>
                 <div className="col-md-12">
                        <label> Password *</label>
                        <input type="password" value={this.state.password} onChange={(event)=>this.setState({password: event.target.value})} required/>
                 </div>
             </div>
          );
        }

        if(this.props.state.tickets.length > 0){			
            this.props.state.tickets.map((item,index) =>{
    				let amount = Number(item.price)*Number(item.quantity);
    				subtotal = amount + subtotal;				
    			});

          gst = subtotal * 0.05;
          gst= Math.round( gst * 100 ) / 100;
          total = subtotal + gst;
		    }

        return(

            <div className="container"> 

                 <h1> Confirm Your Account </h1>
                 <div className="payment-tile"> 
                      {msg}                    
                      <form className="LoginForm row" onSubmit={(event) => this.FormHandler(event)}>
                          <div className="col-md-6 form-group">
                              <label> Email * </label>
                              <input type="text" value={this.state.user} onChange={(event)=>this.setState({user: event.target.value})} required/>
                          </div>
                          <div className="col-md-6 form-group">
                              <label> Phone Number * </label>
                              <input type="text" value={this.state.phone} onChange={(event)=>this.setState({phone: event.target.value})} required/>
                          </div>
                          <div className="col-md-6 form-group">
                               <label> First Name * </label>
                               <input type="text" value={this.state.firstname} onChange={(event)=>this.setState({firstname: event.target.value})} required/>
                          </div>
                          <div className="col-md-6 form-group">
                               <label> Last Name * </label>
                               <input type="text" value={this.state.lastname} onChange={(event)=>this.setState({lastname: event.target.value})} required/>
                          </div>
                          {password_field}
                          <div className="col-md-4 col-md-offset-4">
                               <button className="btn" type="submit"> Update </button>
                          </div>
                      </form> 
                  </div>

               

                  <StripeProvider apiKey="pk_test_eJH3BMV0metBp2P9ifEgdNTb00RuLa5mJw">
                     <div>
                        <Elements>
                            <CheckoutForm total={total} subtotal={subtotal} gst={gst} checkout={checkout} userID={usr} token={token} tickets={tickets} />
                        </Elements>
                     </div>
                  </StripeProvider>

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
        flash: (msg) => dispatch({type: actionTypes.FLASH_MESSAGE, message:msg}),
        updated: (data) => dispatch({type: actionTypes.UPDATE_USER, payload: data})    
    }

};


export default connect(mapStateToProps,mapDispatchToProps)(Proceed);


