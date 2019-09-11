import React, { Component } from 'react';
import './NavEvents.module.css';
import axios from 'axios';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';
import Spinner from '../Spinner/Spinner';
import {NavLink , Link} from 'react-router-dom';


class NavEvents extends Component{

	state = {
		events: [],
		quantity: 1,
		error: false,
		loading: true,
		message: null
	}

	componentWillMount(){
      
      axios.get('http://localhost:5000/events').then(response=>{
      this.setState({events: response.data.events, loading: false});
      }).catch(error=>{this.setState({error:true, loading: false})});

    }

	addToCart=(event)=>{
		this.setState({loading: true});
		let item = {key: event.key, quantity: this.state.quantity , price: event.price, title: event.name};
		let all_tickets = this.props.state.tickets;
		//console.log(this.props.state.tickets);
		let new_item = true;
        if(all_tickets.length > 0){
        	for(let ticket in all_tickets){
				if(all_tickets[ticket].key === event.key){
					new_item = false;
					all_tickets[ticket].quantity += Number(this.state.quantity);
				}			 
			}
        }
        
        if (new_item){
           all_tickets.push(item);
        }
        
		
		this.props.addtoCart(all_tickets);

		setTimeout(
			function() {
				this.setState({loading: false ,quantity: 1});
			}
			.bind(this),
			300
		);


	}

	book_rsvp=(event_ID)=>{

		const data = {
			userID: this.props.state.userID,
			event: event_ID
		};

		var add_rsvp = {
			"async": true,
			"crossDomain": true,
			"url": "http://localhost:5000/rsvp",
			"method": "POST",
			"headers": {
			  "Content-Type": "application/json",
			  "Accept": "*/*",
			  "Cache-Control": "no-cache",
			  "Host": "localhost:5000",
			  "accept-encoding": "gzip, deflate",
			  "Connection": "keep-alive",
			  "cache-control": "no-cache",
			  "Authorization": "Bearer " + this.props.state.token
			},
			"processData": false,
			"data": data
	
		  };

		  axios(add_rsvp).then(response => {
			this.setState({message: response.data.message});
			console.log(this.state)

		  }).catch(error=> {
			//console.log(error);
		  });
	}

	rsvp = (event_key) =>{
        let rsvp = null;
        if(!this.props.state.loggedin){
        	rsvp = <div className="clearfix"> <Link to="/login" className="btn pull-right"> RSVP </Link></div>;
        }else{
        	rsvp = <div className="clearfix"><a className="btn pull-right" onClick={() => this.book_rsvp(event_key)}> RSVP </a></div>;
        }

        return rsvp;
	}




	render (){


        
        var msg = <div className="msg"> {this.state.message} </div>; 
		const events = this.state.events.map(event =>{
			if (parseFloat(event.price) <1)
			{
				return(
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
							
							{this.rsvp(event.key)}
							
						</div>
						</div>
					</div>
				
			)}
			
			if (parseFloat(event.inventory) <1){
				return (
					<div className="event" key={event.key}>
					<div className="row">
					<div className="col-md-4 col-sm-6 col-xs-12">
						<div className="img-container"><img src={event.mainimage} alt={event.name} /></div>
					</div>
					<div className="col-md-8 col-sm-6 col-xs-12">
						<div className="clearfix">
							<h2>{event.name} SOLD OUT!</h2>
							<span className="pull-right">{event.date}</span>
						</div>
						<div className="desc" dangerouslySetInnerHTML={{ __html: event.desc }}  />						    
						<div className="row">
							<div className="col-md-3 pull-right">
								<span className="price">$ {event.price} CAD</span>
							</div>
						</div>
						
					</div>
					</div>
				</div>

				)
			}
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
										<input type="number" value={this.state.quantity} min="0" max="5" className="form-control" onChange={(event) => this.setState({quantity: Number(event.target.value)})}/>
										<div className="input-group-btn" ><a className="btn" onClick={() => this.addToCart(event)}> Add to cart </a></div>
									</div>
								</div>
							</div>
							
						</div>
						</div>
					</div>
				
			);
		});


		let show = null
		if(this.state.loading){
			show = <Spinner msg='Adding to Cart'/>;

		}
		else{
			show = events;
			
		}

            return <div className="container"><h1> Events & Tickets </h1> {msg} {show} </div>;

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
