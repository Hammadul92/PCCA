import './Footer.module.css';
import React from 'react';

class Footer extends React.Component{

	render (){
		return (
				<footer class="footer">

					<div class="footer-socials">
						<a href="#"><i class="fa fa-facebook"></i></a>
						<a href="#"><i class="fa fa-twitter"></i></a>
						<a href="#"><i class="fa fa-instagram"></i></a>
					</div>

					<div class="footer-bottom">
						<i class="fa fa-copyright"></i> Copyright 2015. All rights reserved.<br />
						Theme made by <a href="http://www.moozthemes.com">MOOZ Themes</a>
					</div>
				</footer>

			);
	}
}

export default Footer;