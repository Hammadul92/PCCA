import React, { Component } from 'react';
import './NavEvents.module.css';
import axios from 'axios';

class NavEvents extends Component{

	state = {
	    events: [],
	    error: false
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
	

	render (){

			const events = this.state.events.map(event =>{
				return (
					

						<div className="event" key={event.event_ID}>
						  <div className="row">
						    <div className="col-md-4 col-sm-6 col-xs-12">
						       <div className="img-container"><img src={event.mainimage} alt={event.event_ID} /></div>
						    </div>
						    <div className="col-md-8 col-sm-6 col-xs-12">
						        <div className="clearfix">
						            <h2>{event.name}</h2>
							        <span className="pull-right">{event.date}</span>
								</div>
							    <div dangerouslySetInnerHTML={{ __html: event.desc }} />
							    
							    <div className="row">
							        <div className="col-md-3 pull-right">
							            <span className="price">$ {event.price} CAD</span>
									    <div className="input-group">
										    <input type="number" Value="1" min="1" max="5" className="form-control" />
										    <div className="input-group-btn"><a className="btn" href="#"> Add to cart </a></div>
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



export default NavEvents;
