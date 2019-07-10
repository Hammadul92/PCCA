import React from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import './Cart.module.css';
import {Link} from 'react-router-dom';

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
			msg = <p> You do not have any items in the cart!</p>
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

			checkout=(<div className="form-group clearfix"><Link to="/checkout" className="btn pull-right">Proceed to Checkout</Link></div>);
		}

		return(
            <div className="container">         
                
                <h1>Cart Items</h1>
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
                
                
                <h2> Total: $ {total} cad </h2>
				{checkout}  
					
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


