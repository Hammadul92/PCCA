
import Auxilary from '../../hoc/Auxilary/Auxilary';
import React from 'react';
import classes from './Donations.module.css';

class Donations extends React.Component{

	render (){
		return (
	
			<Auxilary>
				
				<div className= 'donate'>
				<script src="https://embed-cdn.surveyhero.com/popup/user/main.af4ba72c.js" async></script>
				<h1> Donations/Zakat</h1>
				<a href="https://surveyhero.com/e/af4ba72c" onClick="SurveyHero.Popup.open('af4ba72c'); return false;">Take Our Survey</a>
					<iframe src="https://donorbox.org/embed/pay-your-zakat-1?show_content=true&hide_donation_meter=true" height="685px" width="450px"  seamless="seamless" name="donorbox" frameBorder="0" scrolling="no" allowpaymentrequest="true"></iframe>
				</div>	
			</Auxilary>
			);
	}
}

export default Donations;