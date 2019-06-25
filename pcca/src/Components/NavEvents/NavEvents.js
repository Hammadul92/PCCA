import React, { Component } from 'react';
import './NavEvents.module.css';
import axios from 'axios';
//import {connect} from 'react-redux';
//import * as actionTypes from '../../store/actions';


class NavEvents extends Component{

	state = {
		events: [],
		quantity: 0,
		error: false,
		cart: []
	}

	componentWillMount(){
      
      axios.get('http://localhost:5000/events').then(response=>{
      this.setState({events: response.data.events});
      }).catch(error=>{this.setState({error:true})});

    }

	// 'date': data.date,
	// 'disable': data.disable,
	// 'desc': data.desc, 
	// 'price':data.price, 
	// 'inventory': data.inventory,
	// 'mainimage': data.mainimage,
	// 'taxable': data.taxable
	addToCart=(id)=>{
		 //console.log(id.key, 'SELECTED EVENT',id.price);
		 let cart = this.state.cart;
		 let item = {key: id.key, quatity: this.state.quantity , price: id.price};
		 cart.push(item);
		 // assign a name of list to item list
		 this.setState({
			 cart: cart
		 });
		console.log('CURRENT CART',cart);
	}
	

	render (){

			const events = this.state.events.map(event =>{
				return (
					

						<div className="event" key={event.key}>
						  <div className="row">
						    <div className="col-md-4 col-sm-6 col-xs-12">
						       <div className="img-container"><img src={event.mainimage} alt={event.name} /></div>
						    </div>
						    <div className="col-md-8 col-sm-6 col-xs-12">
						        <div className="clearfix">
						            <h2>{event.name}</h2>
							        <span className="pull-right">{event.date}</span>
								</div>
							    <div dangerouslySetInnerHTML={{ __html: event.desc }}  />
							    
							    <div className="row">
							        <div className="col-md-3 pull-right">
							            <span className="price">$ {event.price} CAD</span>
									    <div className="input-group">
										    <input type="number" value={this.state.value} min="0" max="5" className="form-control" onChange={(event) => this.setState({quantity: event.target.value})}/>
												<div className="input-group-btn" ><a className="btn" onClick={() => this.addToCart(event)} > Add to cart </a></div>
										</div>
									</div>
							    </div>
							    
							</div>
						  </div>
						</div>
				    
				);
			});


            return <div className="container"><h1> EVENTS AND TICKETS</h1> {events} </div>;

	}
}




// const mapDispatchToProps = dispatch =>{  
//     return{
//         addtoCart: (ticket) => dispatch({type: actionTypes.LOGGED_IN, newItem:ticket})
    
//     }

// }; connect(null,mapDispatchToProps)



export default (NavEvents);
