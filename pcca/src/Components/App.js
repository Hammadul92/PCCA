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



class App extends React.Component{
	state = {
		loggedin: false,
		token: null,
		message: null
	}
	
	
	componentWillMount(){
		//CREATEING TOKEN//
	
		 //ACCESS A PRIVATE ROUTE
		   
		 var test2 = {
			"async": true,
			"crossDomain": true,
			"url": "http://localhost:5000/userlogin",
			"method": "POST",
			"headers": {
			  "Content-Type": "application/json",
			  "Accept": "*/*",
			  "Cache-Control": "no-cache",
			  "Host": "localhost:5000",
			  "accept-encoding": "gzip, deflate",
			  "Connection": "keep-alive",
			  "cache-control": "no-cache"
			},
			"processData": false,
			"data": "{\n    \"email\": \"info@pcca.com\",\n    \"password\": \"1paklah92\"\n}"
	
		  };
		   axios(test2)
		   .then(response => {
			 console.log(response.data.access_token);
			 if (response.data.access_token){
				this.setState({token: response.data.access_token, loggedin: true , message: response.data.message});
				console.log('STATE',this.state.loggedin);
			 }
			 else{
				console.log('STATE logged in',this.state.loggedin);
				this.setState({token: null, loggedin: false , message: response.data.message});
			 }
			 
		   })
		   .catch(error=> {
			 console.log(error);
		   });
	
	
	}

	
	
	render(){

       return (

       	<Auxilary>
	       	 <NavBar loggedin = {this.state.loggedin}/>
		
				<Switch>
								
					<Route path='/events' exact component={NavEvents}/>
					<Route path='/donations' exact component={Donations}/>
					<Route path='/about' exact component={AboutUs}/>
					<Route path='/contact' exact component={Contact}/>
					<Route path='/gallery' exact component={Gallery}/>
					<Route path='/' exact component={Home}/>
					<Route path='/profile' exact component={Profile}/>
					<Route path='/login' exact component={Login}/>

					
	

				</Switch>	


	         <Footer />
         </Auxilary>
       );
	}
	
}

export default App; 