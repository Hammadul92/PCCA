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
        let lastname = '';
        let email = '';
        let items=null;
        let total = 0;


        if(this.props.state.tickets.length > 0){
			
            this.props.state.tickets.map((item,index) =>{
				let subtotal = Number(item.price)*Number(item.quantity);
				total = subtotal + total;
				
			});

		}
        return(

               <div className="container">   
                  <StripeProvider apiKey="pk_test_TYooMQauvdEDq54NiTphI7jx">
                     <div className="example">
                        <Elements>
                            <CheckoutForm firstname={name} lastname={lastname} email={email} />
                        </Elements>
                     </div>
                  </StripeProvider>
                  <h3>Purchase Total: {total} </h3>
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


