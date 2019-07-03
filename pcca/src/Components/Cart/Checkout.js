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

        <div className="form-group">
          <h4>Would you like to complete the purchase?</h4> 

          <div className="example2 form-group"><CardElement /></div>         
          <button className="btn" onClick={this.submit}> Complete Transaction </button>
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
