import React from 'react';
import Auxilary from '../hoc/Auxilary/Auxilary'
import NavBar from './NavBar/NavBar';
import Footer from './Footer/Footer';
import Gallery from './Gallery/Gallery';
import NavEvents from './NavEvents/NavEvents';
import Donations from './Donations/Donations';
import Contact from './Contact/Contact';
import AboutUs from './AboutUs/AboutUs';
import Profile from './Profile/Profile';

import Home from './Home';

import Login from './Login/Login';

import './App.css';
import {Route,Switch} from 'react-router-dom';

import axios from 'axios';

//import unsplash from '../api/unsplash';
//import ImageList from './imageList';
import { connect } from 'react-redux';



class App extends React.Component{
	
	
	
	componentWillMount(){	
		console.log('AppJS Mounted');
	
	
	}

	
	
	render(){

       return (

       	<Auxilary>
	       	 <NavBar loggedin={this.props.test}/>
		
				<Switch>
								
					<Route path='/events' exact component={NavEvents}/>
					<Route path='/donations' exact component={Donations}/>
					<Route path='/about' exact component={AboutUs}/>
					<Route path='/contact' exact component={Contact}/>
					<Route path='/gallery' exact component={Gallery}/>
					<Route path='/profile' exact component={Profile}/>
					<Route path='/login' exact component={Login}/>
					<Route path='/' exact component={Home}/>

					
	

				</Switch>	


	         <Footer />
         </Auxilary>
       );
	}
	
}


const mapStateToProps = state => {
	console.log(state);
	return{
  
	    test: state.loggedin
	    
	}
  };

export default connect(mapStateToProps)(App); 