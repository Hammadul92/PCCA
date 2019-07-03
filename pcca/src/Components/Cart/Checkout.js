import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import './Checkout.css';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {complete: false};
    this.submit = this.submit.bind(this);
  }

  async submit(ev) {
    // User clicked submit
    let {token} = await this.props.stripe.createToken({name: this.props.name});
    console.log(token.card, 'TOKEN ID', token.id );
    let response = await fetch("/charge", {
      method: "POST",
      headers: {"Content-Type": "text/plain"},
      body: token.id
    });
  
    if (response.ok){this.setState({complete: true}); console.log("Purchase Complete!");} 
  }

  render() {
    return (
      <div className="example2">
        <p className='text-center'>Would you like to complete the purchase?</p>
        <CardElement />
        <button onClick={this.submit}>Send</button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
