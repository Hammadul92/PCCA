
import React from 'react';
import axios from 'axios';

class AboutUs extends React.Component{	
	state = {
		page_description: '',
	}

	componentWillMount(){      
      axios.get('https://www.pakcan.com/api/about_us').then(response=>{
      this.setState({page_description: response.data.page_description});
      }).catch(error=>{});

    }

	render (){
		let page_description = <div className="form-group" dangerouslySetInnerHTML={{ __html: this.state.page_description}}  />		
		return(
            <div className="container">
                 <h1> About Us</h1>
                 {page_description}    
            </div>               
        );
	}
}

export default AboutUs;