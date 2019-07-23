import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import axios from 'axios';
import './Cart.module.css';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {message: null};
    this.submit = this.submit.bind(this);
  }


  async submit(ev) {
    let {token} = await this.props.stripe.createToken({name: this.props.name});
        const data = {
              userID: this.props.userID,
              token_id: token.id,
              brand: token.card.brand,
              country: token.card.country,
              last4: token.card.last4,
              exp_year: token.card.exp_year
        };  

        var request = {
              "async": true,
              "crossDomain": true,
              "url": "http://68.183.207.29:5000/banking_information",
              "method": "POST",
              "headers": {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Cache-Control": "no-cache",
                "Host": "localhost:5000",
                "accept-encoding": "gzip, deflate",
                "Connection": "keep-alive",
                "cache-control": "no-cache",
                "Authorization": "Bearer " + this.props.token
              },
              "processData": false,
              "data": data
        };
 
        axios(request).then(response => {

           let all_tickets = this.props.tickets
           let cart = all_tickets.reduce(
            (obj, item) => Object.assign(obj, {
                          [item.key]: {
                            quantity: item.quantity
                          }}) ,{});


           const payment_data = {
              userID: this.props.userID,
              total: (this.props.total),
              cart: cart,
              subtotal: this.props.subtotal,
              gst: this.props.gst
            };  

            var payment_request = {
              "async": true,
              "crossDomain": true,
              "url": "http://68.183.207.29:5000/charge",
              "method": "POST",
              "headers": {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Cache-Control": "no-cache",
                "Host": "localhost:5000",
                "accept-encoding": "gzip, deflate",
                "Connection": "keep-alive",
                "cache-control": "no-cache",
                "Authorization": "Bearer " + this.props.token
              },
              "processData": false,
              "data": JSON.stringify(payment_data)
            };
            axios(payment_request).then(response => {             
                this.setState({message: response.data.message});
            }).catch(error=> {});

        }).catch(error=> {});
  }

  render() {


    if(this.state.message == null){

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
              <div className="bill">
                <b>Subtotal:</b> $ {this.props.subtotal} CAD <br/>
                <b>GST:</b> $ {this.props.gst} CAD <br/>
                <b>Purchase Total:</b> $ {this.props.total} CAD 
              </div>
              <hr/>
              <p>Would you like to complete the purchase?</p> 
              <div className="example2 form-group"><CardElement /></div>         
              {button}
            </div>
          </div>

      );
      
    }else{
      return (
         <div className="text-center distance">
            <img src="https://www.naturallysplendid.com/static/media/success.png" />
            <h3> Your payment was successfully processed </h3>          
         </div>
      )
    }

    
  }
}




export default injectStripe(CheckoutForm);
