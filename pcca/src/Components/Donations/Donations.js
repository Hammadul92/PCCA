
import Auxilary from '../../hoc/Auxilary/Auxilary';
import React from 'react';
import classes from './Donations.module.css';

class Donations extends React.Component{

	render (){
		return (
				<Auxilary>
                        <h1 className={classes.h1}> Donations/Fundraisers</h1>	
	            </Auxilary>
			);
	}
}

export default Donations;