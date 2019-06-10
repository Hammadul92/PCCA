import './NavBar.module.css';
import React from 'react';

class NavBar extends React.Component{

	render (){
		return (
				<nav className="navbar navbar-inverse navbar-fixed-top">
					<div className="container">
						<div className="navbar-header">
							<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
							<span class="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span class="icon-bar"></span>
							<span className="icon-bar"></span>
							</button>
						</div>
						<div id="navbar" className="collapse navbar-collapse">
							<ul className="nav navbar-nav">
								<li className="active"><a href="index.html">Home</a></li>
								<li><a href="#about">Events</a></li>
								<li><a href="#contact">Donations</a></li>
								<li><a href="#contact">Gallery</a></li>
								<li><a href="about.html">About Us</a></li>
								<li><a href="about.html">Contact</a></li>
							</ul>

							<ul class="nav navbar-nav navbar-right">
								<li><a href="#"><i className="fa fa-facebook"></i></a></li>
								<li><a href="#"><i className="fa fa-twitter"></i></a></li>
								<li><a href="#"><i className="fa fa-instagram"></i></a></li>

							</ul>

						</div>
					</div>
				</nav>

			);
	}
}

export default NavBar;