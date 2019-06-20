
import Auxilary from '../../hoc/Auxilary/Auxilary';
import React, { Component } from 'react';
import classes from './NavEvents.module.css';

class NavEvents extends Component{
	

	render (){


		return (
				<Auxilary>
                        <h1 className={classes.h1}> EVENTS AND TICKETS</h1>
	            </Auxilary>
			);
	}
}



export default (NavEvents);
