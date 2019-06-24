import './NavBar.module.css';
import React from 'react';
import {NavLink} from 'react-router-dom';
import Auxilary from '../../hoc/Auxilary/Auxilary';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';

class NavBar extends React.Component{


	render (){
		
		var user = null;
		if (this.props.loggedin){
            //Get user data prop
			user = (
				<Auxilary> 
			      <li><NavLink to="/profile" activeStyle={{fontWeight: "bold", color: "White"}}>Profile</NavLink></li>
				  <li><a href="/" onClick={this.props.loggedOut}> Log Out </a></li>
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

						</div>

						<div>
							

						</div>
					</div>
				</nav>

			);
	}
}

const mapDispatchToProps = dispatch =>{  
    console.log('DispatchLogged out')
    return{
        loggedOut: () => dispatch({type: actionTypes.LOGGED_OUT})
    
    }

};


export default connect(null,mapDispatchToProps)(NavBar);