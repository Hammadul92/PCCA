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

        <div>
          <h1 className="text-center"> Confirm Your Account </h1>
          <hr/>
          <form className="LoginForm row" onSubmit={(event) => this.updateFormHandler(event)}>
              <div className="col-md-6 form-group">
                  <label> Email </label>
                  <input type="text" value={this.state.user} onChange={(event)=>this.setState({user: event.target.value})} required/>
              </div>
              <div className="col-md-6 form-group">
                  <label> Phone Number </label>
                  <input type="text" value={this.state.phone} onChange={(event)=>this.setState({phone: event.target.value})} required/>
              </div>
              <div className="col-md-6 form-group">
                   <label> First Name </label>
                   <input type="text" value={this.state.firstname} onChange={(event)=>this.setState({firstname: event.target.value})} required/>
              </div>
              <div className="col-md-6 form-group">
                   <label> Last Name </label>
                   <input type="text" value={this.state.lastname} onChange={(event)=>this.setState({lastname: event.target.value})} required/>
              </div>
              <div className="col-md-6 col-md-offset-3 form-group">
                   <button className="btn" type="submit"> Update </button>
              </div>

          </form>

          <div className="payment-tile">
            <h4>Purchase Total: $ {this.props.total} CAD </h4>
            <p>Would you like to complete the purchase?</p> 
            <div className="example2 form-group"><CardElement /></div>         
            <button className="btn" onClick={this.submit}> Complete Transaction </button>
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
