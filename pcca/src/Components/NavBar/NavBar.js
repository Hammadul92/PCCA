import './NavBar.module.css';
import React from 'react';
import {NavLink} from 'react-router-dom';
import Auxilary from '../../hoc/Auxilary/Auxilary';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';

class NavBar extends React.Component{


	render (){
		
		var user = null;
		if (this.props.state.loggedin){         
			user = (
				<Auxilary> 
			      <li><NavLink to="/profile" activeStyle={{fontWeight: "bold", color: "White"}}> <i className="fa fa-user"></i> {this.props.state.firstname} </NavLink></li>
				  <li><NavLink to="/login" onClick={this.props.loggedOut}> Log Out </NavLink></li>
			    </Auxilary>
		     );

        }
        else{
             user = (
				<Auxilary> 
			      <li><NavLink to="/login" activeStyle={{fontWeight: "bold", color: "White"}}>Login</NavLink></li>
			      <li><NavLink to="/signup" activeStyle={{fontWeight: "bold", color: "White"}}>Register</NavLink></li>
			    </Auxilary>
		     );

		}
		
		var cart = this.props.state.tickets;
		var itemNum = cart.length;
		if(itemNum){
			 var checkout = <li><NavLink to="/checkout" > Cart {itemNum}  </NavLink></li>
		}
		console.log(cart, 'Cart Length',cart.length);
		return (
				<nav className="navbar navbar-inverse navbar-fixed-top">
					<div className="container">
						<div className="navbar-header">
							<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							</button>
						</div>
						<div id="navbar" className="collapse navbar-collapse">
							<ul className="nav navbar-nav">
							
								<li ><NavLink exact  to="/"  activeStyle={{fontWeight: "bold", color: "White"}}>Home</NavLink></li>
								<li><NavLink to="/events" activeStyle={{fontWeight: "bold", color: "White"}}>Events</NavLink></li>
								<li><NavLink to="/donations" activeStyle={{fontWeight: "bold", color: "White"}}>Donations</NavLink></li>
								<li><NavLink to="/gallery" activeStyle={{fontWeight: "bold", color: "White"}}>Gallery</NavLink></li>
								<li><NavLink to="/about" activeStyle={{fontWeight: "bold", color: "White"}}>About Us</NavLink></li>
								<li><NavLink to="/contact" activeStyle={{fontWeight: "bold", color: "White"}}>Contact</NavLink></li>
								

							</ul>

							<ul className="nav navbar-nav navbar-right">{user}</ul>
							<ul className="nav navbar-nav navbar-right">{checkout}</ul>

						</div>

						<div>
							

						</div>
					</div>
				</nav>

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
        loggedOut: () => dispatch({type: actionTypes.LOGGED_OUT})
    
    }

};




export default connect(mapStateToProps,mapDispatchToProps)(NavBar);