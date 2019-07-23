
import Auxilary from '../../hoc/Auxilary/Auxilary';
import React from 'react';
import classes from './Donations.module.css';

class Donations extends React.Component{

	render (){
		return (
	
			<Auxilary>
				
				<div className= 'donate'>
				<h1> Donations/Zakat</h1>
					<iframe src="https://donorbox.org/embed/pay-your-zakat-1?show_content=true&hide_donation_meter=true" height="685px" width="500px"  seamless="seamless" name="donorbox" frameBorder="0" scrolling="no" allowpaymentrequest="true"></iframe>
				</div>	
			</Auxilary>
			);
	}
}

export default Donations;