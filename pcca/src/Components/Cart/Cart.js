
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import CheckoutForm from './Checkout';
import {Elements, StripeProvider} from 'react-stripe-elements';
import './Cart.module.css';

class Cart extends React.Component{


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
		console.log(this.props.state);
        if(this.props.state.tickets.length >0){
			
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
			checkout=(<div className="form-group"><h2>Total: $ {total} cad </h2></div>);
		}

		return(
            <div className="container">         
                
                <h1 className="text-center">Cart Items</h1>
				{msg}
                <table className="table">
                    <thead>
                       <tr>
                        <th>Event Name</th>
                        <th> Ticket Price</th>
						<th> Subtotal </th>
						<th></th>
                       </tr>
                    </thead>
                    <tbody>
							{items}                        
                    </tbody>

			    </table>   
				{checkout} 
					
				<StripeProvider apiKey="pk_test_TYooMQauvdEDq54NiTphI7jx">
					<div className="example">
						<h2 className="text-center">Payment Method</h2>
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


