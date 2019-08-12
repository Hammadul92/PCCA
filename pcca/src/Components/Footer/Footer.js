import './Footer.module.css';
import React from 'react';

class Footer extends React.Component{

	render (){
		return (
				<footer className="footer">
					<div className="footer-socials">
						<img className='image' src="logo.jpg" alt="Logo" />
						<a href="https://www.facebook.com/joinpakcan/" target="_blank"><i className="fa fa-facebook"></i></a>
						
					</div>



					<div className="footer-bottom">
						
						<i className="fa fa-copyright"></i> Copyright 2019. All rights reserved.<br />
						Developed By <a href="#"> Hammad Ul Hassan & Fraz Tahir</a>
						 
					</div>
				</footer>

			);
	}
}

export default Footer;