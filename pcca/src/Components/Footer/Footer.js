import './Footer.module.css';
import React from 'react';

class Footer extends React.Component{

	render (){
		return (
				<footer className="footer">

					<div className="footer-socials">
						<a href="#"><i className="fa fa-facebook"></i></a>
						<a href="#"><i className="fa fa-twitter"></i></a>
						<a href="#"><i className="fa fa-instagram"></i></a>
					</div>

					<div className="footer-bottom">
						<i className="fa fa-copyright"></i> Copyright 2015. All rights reserved.<br />
						Theme made by <a href="http://www.moozthemes.com">MOOZ Themes</a>
					</div>
				</footer>

			);
	}
}

export default Footer;