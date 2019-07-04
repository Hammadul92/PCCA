import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import * as actionTypes from '../../store/actions';
import './Cart.module.css';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {complete: false};
    this.submit = this.submit.bind(this);
  }

  async submit(ev) {
    let {token} = await this.props.stripe.createToken({name: this.props.name});
    console.log('CARD',token.card, 'TOKEN ID', token.id,'TOTAL', this.props.total );
    let response = await fetch("/charge", {
      method: "POST",
      headers: {"Content-Type": "text/plain"},
      body: token.id
    });
  
    if (response.ok){this.setState({complete: true}); console.log("Purchase Complete!");} 
  }

  render() {

    let button = null
    
    if(this.props.checkout){
      button = <button className="btn" onClick={this.submit}> Complete Transaction </button>
    }else{
      button = <button className="btn" disabled title="Please confirm your account before finishing purchase."> Complete Transaction </button>
    }


    return (
        <div> 
          <h1> Make a Payment</h1>
          <div className="payment-tile">
            <h4>Purchase Total: $ {this.props.total} CAD </h4>
            <p>Would you like to complete the purchase?</p> 
            <div className="example2 form-group"><CardElement /></div>         
            {button}
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
        flash: (msg) => dispatch({type: actionTypes.FLASH_MESSAGE, message:msg}),
        updated: (data) => dispatch({type: actionTypes.UPDATE_USER, payload: data})
    
    }

};

export default injectStripe(CheckoutForm);
