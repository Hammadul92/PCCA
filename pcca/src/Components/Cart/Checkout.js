import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import * as actionTypes from '../../store/actions';
import axios from 'axios';
import './Cart.module.css';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {complete: false};
    this.submit = this.submit.bind(this);
  }

  ComponentWillMount(){
    console.log(this.props.userID);
  }

  async submit(ev) {
    let {token} = await this.props.stripe.createToken({name: this.props.name});
        console.log(this.props.userID);
        const data = {
              userID: this.props.userID,
              token_id: token.id,
              brand: token.card.brand,
              country: token.card.country,
              brand: token.card.brand,
              last4: token.card.last4,
              exp_year: token.card.exp_year
        };  

        var request = {
              "async": true,
              "crossDomain": true,
              "url": "http://localhost:5000/banking_information",
              "method": "POST",
              "headers": {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Cache-Control": "no-cache",
                "Host": "localhost:5000",
                "accept-encoding": "gzip, deflate",
                "Connection": "keep-alive",
                "cache-control": "no-cache"
              },
              "processData": false,
              "data": data
        };

        axios(request).then(response => {
           this.props.flash(response.data.message);
           this.props.updated(data);
        }).catch(error=> {});
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
