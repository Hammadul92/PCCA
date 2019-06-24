
import Auxilary from '../../hoc/Auxilary/Auxilary';
import React, { Component } from 'react';
import classes from './NavEvents.module.css';
import axios from 'axios';

class NavEvents extends Component{
	state = {
		message:null,
		events: null
	}

	componentWillMount() {
		var req = {
			"async": true,
			"crossDomain": true,
			"url": "http://localhost:5000/events",
			"method": "GET",
			"headers": {
			  "Content-Type": "application/json",
			  "Accept": "*/*",
			  "Cache-Control": "no-cache",
			  "Host": "localhost:5000",
			  "accept-encoding": "gzip, deflate",
			  "Connection": "keep-alive",
			  "cache-control": "no-cache"
			},
			"processData": false
		  };

		  axios(req)
		  .then(response => {
			//console.log(response.data.access_token);
			if (!response.data.message){
			   this.setState({events: response.data});
			   console.log('response Events',response.data)
			   //()=>this.loggedIn(response.data.access_token);
			   
			}
			else{
				this.setState({ message: response.data.message});
			}
			
		  })
		  .catch(error=> {
			//console.log(error);
		  });


	}

	// 'date': data.date,
	// 'disable': data.disable,
	// 'desc': data.desc, 
	// 'price':data.price, 
	// 'inventory': data.inventory,
	// 'mainimage': data.mainimage,
	// 'taxable': data.taxable
	

	render (){
		let evs = <p style={{textAlign:'center'}}>No Events Listed! </p>;

		if (this.state.events){
			evs = this.state.events.map(event =>{
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
								
							    <p>{event.desc}</p>
							    <hr/>
							    
							    <div className="row">
							        <div className="col-md-3 pull-right">
							            <span className="price">$ {event.price} CAD</span>
									    <div className="input-group">
										    <input type="number" value="1" min="1" max="10" className="form-control" />
										    <div className="input-group-btn"><a className="btn" href="#"> Add to cart </a></div>
										</div>
									</div>
							    </div>
							    
							</div>
						  </div>
						</div>
				    
				);
			});

		}




		return (
				<Auxilary>
				    <div className="container">
                        <h1 className={classes.h1}> EVENTS AND TICKETS</h1>
						{evs}
				    </div>
						
	            </Auxilary>
			);
	}
}



export default (NavEvents);
