import './Footer.module.css';
import React from 'react';

class Footer extends React.Component{

	render (){
		return (
				<footer className="footer">

					<div className="footer-socials">
						<a href="#"><i className="fa fa-facebook"></i></a>
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