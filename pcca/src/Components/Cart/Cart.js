
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import './Checkout.css';
import {Link} from 'react-router-dom';

class Cart extends React.Component{


	removeItem=(index)=>{
		var arr = this.props.state.tickets;
	    arr.splice(index, 1); 
		//console.log(arr, 'INDEX', index);
		this.props.removed(arr);
	}
 
	render (){
		var items = null;
		let msg = null;
		let checkout = null;
		let total = 0;
		let summary = null;


		
		if(this.props.state.tickets.length === 0){
			msg =  <p> You do not have any items in the cart!</p>
		};
		console.log(this.props.state);
        if(this.props.state.tickets.length >0){
            //console.log(this.props.state.tickets, 'CART Checkout')
			
            items = this.props.state.tickets.map((item,index) =>{
				let subtotal = Number(item.price)*Number(item.quantity);
				total = subtotal + total;
				return (
					<tr key={index}>
                    <td>{index}</td>
                    <td>{item.title}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
					<td>{subtotal}</td>
					<td><button type="button" className="btn-danger" onClick={() => this.removeItem(index)}> Remove</button></td>

				    </tr>
				);
			});

		}
		if (total>0){
			checkout = (<div className="col-md-6 col-md-offset-3 form-group text-center">
							<Link to="/proceed"><button  className="btn"> Proceed With Checkout Total ${total} </button></Link> 
						</div>   
							);
		    summary = (
						<tr>
							<td> </td>
							<td> </td>
							<td className="left">
								<strong>Total</strong>
							</td>
							<td className="left">
								<strong>{total}</strong>
							</td>
						</tr>);

		}

        

		return(
            <div className="container">

            
                
                <h1>Cart Items: </h1>
				{msg}
                <table className="table">
                    <thead>
                        <tr>
                        <th></th>
                        <th>Title</th>
                        <th>Quantity</th>
                        <th>Price</th>
						<th>Sub-Total</th>
						<th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
							{items}
							{summary}
                        
                    </tbody>
					
                    </table>   
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


