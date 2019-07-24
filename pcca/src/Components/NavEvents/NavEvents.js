import React, { Component } from 'react';
import './NavEvents.module.css';
import axios from 'axios';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';
import Spinner from '../Spinner/Spinner';


class NavEvents extends Component{

	state = {
		events: [],
		quantity: 1,
		error: false,
		loading: true
	}

	componentWillMount(){
      
      axios.get('https://pcabc.ca/api/events').then(response=>{
      this.setState({events: response.data.events, loading: false});
      }).catch(error=>{this.setState({error:true, loading: false})});

    }

	addToCart=(event)=>{
		this.setState({loading: true});
		let item = {key: event.key, quantity: this.state.quantity , price: event.price, title: event.name};
		let all_tickets = this.props.state.tickets;
		console.log(this.props.state.tickets);
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


            return <div className="container"><h1> Events & Tickets </h1> {show} </div>;

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
