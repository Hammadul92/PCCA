import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import './Cart.module.css';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  async submit(ev) {
    // User clicked submit
  }

  render() {
    return (
        
        <div className="form-group">
          <h4>Would you like to complete the purchase?</h4>       
          <div className="example2 form-group"><CardElement /></div>         
          <button className="btn" onClick={this.submit}> Complete Transaction </button>
        </div>
    );
  }
}

export default injectStripe(CheckoutForm);
