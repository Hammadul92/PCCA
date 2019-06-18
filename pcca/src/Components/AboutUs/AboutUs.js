
import Auxilary from '../../hoc/Auxilary/Auxilary';
import React from 'react';
import classes from './AboutUs.module.css';

class AboutUs extends React.Component{

	render (){
		return (
				<Auxilary>
                        <h1 className={classes.h1}> About Us</h1>

	            </Auxilary>
			);
	}
}

export default AboutUs;