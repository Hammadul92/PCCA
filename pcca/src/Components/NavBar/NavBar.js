import './NavBar.module.css';
import React from 'react';
import {NavLink} from 'react-router-dom';
import Slider from '../Slider/Slider';
import News from '../News/News';
import Footer from '../Footer/Footer';


class NavBar extends React.Component{

	render (){
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

							<ul className="nav navbar-nav navbar-right">
								<li><a href="#"><i className="fa fa-facebook"></i></a></li>
								<li><a href="#"><i className="fa fa-twitter"></i></a></li>
								<li><a href="#"><i className="fa fa-instagram"></i></a></li>

							</ul>

						</div>

						<div>
							

						</div>
					</div>
				</nav>

			);
	}
}

export default NavBar;