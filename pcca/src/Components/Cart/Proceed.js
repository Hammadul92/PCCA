import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import CheckoutForm from './Checkout';
import {Elements, StripeProvider} from 'react-stripe-elements';
import Auxilary from '../../hoc/Auxilary/Auxilary';
import './Cart.module.css';

class Proceed extends React.Component{

   state = {
       user: this.props.state.user,
       firstname: this.props.state.firstname,
       lastname: this.props.state.lastname,
       phone: this.props.state.phone,
    }

 
	render (){

        let total = 0;


        if(this.props.state.tickets.length > 0){
			
            this.props.state.tickets.map((item,index) =>{
				let subtotal = Number(item.price)*Number(item.quantity);
				total = subtotal + total;
				
			});

		}
        return(

               <div className="container"> 

                 <h1> Confirm Your Account </h1>
                 <div className="payment-tile">                     
                      <form className="LoginForm row" onSubmit={(event) => this.updateFormHandler(event)}>
                          <div className="col-md-6 form-group">
                              <label> Email </label>
                              <input type="text" value={this.state.user} onChange={(event)=>this.setState({user: event.target.value})} required/>
                          </div>
                          <div className="col-md-6 form-group">
                              <label> Phone Number </label>
                              <input type="text" value={this.state.phone} onChange={(event)=>this.setState({phone: event.target.value})} required/>
                          </div>
                          <div className="col-md-6 form-group">
                               <label> First Name </label>
                               <input type="text" value={this.state.firstname} onChange={(event)=>this.setState({firstname: event.target.value})} required/>
                          </div>
                          <div className="col-md-6 form-group">
                               <label> Last Name </label>
                               <input type="text" value={this.state.lastname} onChange={(event)=>this.setState({lastname: event.target.value})} required/>
                          </div>
                          <div className="col-md-6 col-md-offset-3 form-group">
                               <button className="btn" type="submit"> Update </button>
                          </div>
                      </form> 
                  </div>
                  <StripeProvider apiKey="pk_test_TYooMQauvdEDq54NiTphI7jx">
                     <div>
                        <Elements>
                            <CheckoutForm total={total} />
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
        removed: (newCart) => dispatch({type: actionTypes.REMOVE_CART, payload:newCart})
    
    }

};


export default connect(mapStateToProps,mapDispatchToProps)(Proceed);


