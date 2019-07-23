
import Auxilary from '../../hoc/Auxilary/Auxilary';
import React from 'react';
import classes from './Donations.module.css';
import Spinner from '../Spinner/Spinner';
import Thank from '../Thank/Thank';

class Donations extends React.Component{

	render (){
		return (
				<Auxilary>
						
                        <h1 className={classes.h1}> Donations/Fundraisers</h1>	
						<Thank/>
						<Spinner msg='Test '/>
	            </Auxilary>
			);
	}
}

export default Donations;