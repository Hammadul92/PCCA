
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
				<p style={{textAlign:'center'}} key={event.event_ID}>{event.name} {event.name} {event.disable} {event.desc} {event.price}</p>);
			});

		}




		return (
				<Auxilary>
                        <h1 className={classes.h1}> EVENTS AND TICKETS</h1>
						{evs}
						
	            </Auxilary>
			);
	}
}



export default (NavEvents);
