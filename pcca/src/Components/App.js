import React from 'react';
import Auxilary from '../hoc/Auxilary/Auxilary'
import NavBar from './NavBar/NavBar';
import Footer from './Footer/Footer';
import Slider from './Slider/Slider';
import News from './News/News';
import Events from './Events/Events';
import './App.css';
//import unsplash from '../api/unsplash';
//import ImageList from './imageList';

class App extends React.Component{
	state = {images: []}
	
	render(){
       return (

       	<Auxilary>
	       	 <NavBar />

	       	 <div className="container">
	       	    <Slider />

		       	 <section>
				   <div className="row">
					 <div className="col-md-8"><News /></div>
					 <div className="col-md-4 sidebar-gutter">
                         <Events />
					 </div>
				   </div>
				 </section>

			 </div>

	         <Footer />
         </Auxilary>
       );
	}
	
}

export default App; 