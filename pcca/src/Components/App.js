import React from 'react';
import NavBar from './NavBar/NavBar';
//import unsplash from '../api/unsplash';
//import ImageList from './imageList';

class App extends React.Component{
	state = {images: []}
	
	render(){
       return <NavBar />;
	}
	
}

export default App; 