import './Slider.css';
import Auxilary from '../../hoc/Auxilary/Auxilary'
import React from 'react';
import logo from './logo.jpg';

class Slider extends React.Component{

	render (){
		return (
				<Auxilary>
					<header>
						<a href="index.html"><img alt='' title='Logo' src={logo} /></a>
					</header>

					<section className='main-Slider'>
						<ul className='bxslider'>
							<li><div className="slider-item"><img src="http://giants-lt.com/wp-content/uploads/2015/03/community-group.jpg" title="Funky roots" alt=''/></div></li>
							<li><div className="slider-item"><img src="http://giants-lt.com/wp-content/uploads/2015/03/community-group.jpg" title="Funky roots" alt=''/></div></li>
							<li><div className='slider-item'><img src="http://giants-lt.com/wp-content/uploads/2015/03/community-group.jpg" title="Funky roots" alt=''/></div></li>
						</ul>
					</section>


					
	            </Auxilary>
			);
	}
}

export default Slider;





