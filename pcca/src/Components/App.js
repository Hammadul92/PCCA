import React from 'react';
import Auxilary from '../hoc/Auxilary/Auxilary'
import NavBar from './NavBar/NavBar';
import Footer from './Footer/Footer';
import Gallery from './Gallery/Gallery';
import NavEvents from './NavEvents/NavEvents';
import Donations from './Donations/Donations';
import Contact from './Contact/Contact';
import AboutUs from './AboutUs/AboutUs';

import Home from './Home';

import './App.css';
import {Route,Switch} from 'react-router-dom';
//import unsplash from '../api/unsplash';
//import ImageList from './imageList';

class App extends React.Component{
	state = {images: []}
	
	render(){
       return (

       	<Auxilary>
	       	 <NavBar />
		
				<Switch>
								
					
					<Route path='/events' exact component={NavEvents}/>
					<Route path='/donations' exact component={Donations}/>
					<Route path='/about' exact component={AboutUs}/>
					<Route path='/contact' exact component={Contact}/>
					<Route path='/gallery' exact component={Gallery}/>
					<Route path='/' exact component={Home}/>
	

				</Switch>	


	         <Footer />
         </Auxilary>
       );
	}
	
}

export default App; 