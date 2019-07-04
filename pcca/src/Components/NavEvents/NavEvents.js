import React, { Component } from 'react';
import './NavEvents.module.css';
import axios from 'axios';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';


class NavEvents extends Component{

	state = {
		events: [],
		quantity: 1,
		error: false,
	}

	componentWillMount(){
      
      axios.get('http://localhost:5000/events').then(response=>{
      this.setState({events: response.data.events});
      }).catch(error=>{this.setState({error:true})});

    }

	addToCart=(event)=>{
		let item = {key: event.key, quantity: this.state.quantity , price: event.price, title: event.name};
		let all_tickets = this.props.state.tickets;
		let new_item = true;
        if(all_tickets.length > 0){
        	for(let ticket in all_tickets){
				if(all_tickets[ticket].key === event.key){
					new_item = false;
					all_tickets[ticket].quantity += this.state.quantity;
				}			 
			}
        }
        
        if (new_item){
           all_tickets.push(item);
        }
        
		
		this.props.addtoCart(all_tickets);
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
								<div className="desc" dangerouslySetInnerHTML={{ __html: event.desc }}  />						    
							    <div className="row">
							        <div className="col-md-3 pull-right">
							            <span className="price">$ {event.price} CAD</span>
									    <div className="input-group">
										    <input type="number" value={this.state.quantity} min="0" max="5" className="form-control" onChange={(event) => this.setState({quantity: event.target.value})}/>
											<div className="input-group-btn" ><a className="btn" onClick={() => this.addToCart(event)}> Add to cart </a></div>
										</div>
									</div>
							    </div>
							    
							</div>
						  </div>
						</div>
				    
				);
			});


            return <div className="container"><h1> Events & Tickets </h1> {events} </div>;

	}
}




const mapStateToProps = state => {
	return{ 
		state: state   
	}
};

const mapDispatchToProps = dispatch =>{  
    return{
        addtoCart: (tickets) => dispatch({type: actionTypes.ADD_CART, payload:tickets})    
	}
};



export default connect(mapStateToProps,mapDispatchToProps)(NavEvents);
