import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import CheckoutForm from './Checkout';
import {Elements, StripeProvider} from 'react-stripe-elements';
import './Checkout.css';
import Auxilary from '../../hoc/Auxilary/Auxilary';

class Proceed extends React.Component{


 
	render (){

		let firstname = '';
        let email = '';
        let items=null;
        let total = null;

		if(this.props.state.firstname !== ''){
			name = this.props.state.firstname;
            email = this.props.state.user;
        }

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
				    </tr>
				);
			});

		}
        return(
            <Auxilary >
             

             <div className="container">   
            <StripeProvider apiKey="pk_test_TYooMQauvdEDq54NiTphI7jx">
            <div className="example">
            <Elements>
                <CheckoutForm name= {name} email={email} />
            </Elements>
            </div>
            </StripeProvider>


                <h3>Purchase Total: {total} </h3>

            <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Event</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Price</th>
                                <th scope="col">SubTotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items}
                        </tbody>
            </table>

            </div>

            </Auxilary>

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


