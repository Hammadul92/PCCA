
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import CheckoutForm from './Checkout';
import {Elements, StripeProvider} from 'react-stripe-elements';
import './Cart.module.css';

class Cart extends React.Component{

	 state = {
	      user: this.props.state.user,
	      firstname: this.props.state.firstname,
	      lastname: this.props.state.lastname,
	      phone: this.props.state.phone,
	 }

	removeItem=(index)=>{
		var arr = this.props.state.tickets;
	    arr.splice(index, 1); 
		this.props.removed(arr);
	}
 
	render (){
		var items = null;
		let msg = null;
		let checkout = null;
		let total = 0;
		if(this.props.state.tickets.length === 0){
			msg =  <p> You do not have any items in the cart!</p>
		};

        if(this.props.state.tickets.length > 0){			
            items = this.props.state.tickets.map((item,index) =>{
				let subtotal = Number(item.price)*Number(item.quantity);
				total = subtotal + total;
				return (
					<tr key={index}>
	                    <td>{item.title} ( &times; {item.quantity})</td>
	                    <td> $ {item.price} cad</td>
						<td> $ {subtotal} cad</td>
						<td><a className="btn-sm btn-danger" onClick={() => this.removeItem(index)}> Remove</a></td>
				    </tr>
				);
			});

		}
		
		if (total>0){
			checkout=(<div className="form-group"><h3>Total: $ {total} cad </h3></div>);
		}

		return(
            <div className="container">         
                
                <h2>Cart Items</h2>
				{msg}
                <table className="table">
                    <thead>
                       <tr>
                        <th> Event Name</th>
                        <th> Ticket Price</th>
						<th> Subtotal </th>
						<th></th>
                       </tr>
                    </thead>
                    <tbody>{items}</tbody>
			    </table> 

				{checkout}

                <h2> User Information</h2>
				<div className="row LoginForm ">
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
                                   <div className="col-md-12 form-group">
                                     <button className="btn" type="submit"> Update </button>
                                   </div>
                </div>  
					
				<StripeProvider apiKey="pk_test_TYooMQauvdEDq54NiTphI7jx">
					<div>
						<Elements>
							<CheckoutForm />
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


export default connect(mapStateToProps,mapDispatchToProps)(Cart);


