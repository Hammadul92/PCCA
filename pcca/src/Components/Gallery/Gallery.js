import React from 'react';
import ImageList from './imageList';
import axios from 'axios'

class Gallery extends React.Component{
  state = {
    images: [],
    error: false
  }

  componentWillMount(){
      
      axios.get('http://localhost:5000/gallery').then(response=>{
      this.setState({images: response.data.images});
      }).catch(error=>{this.setState({error:true})});

  }

  render(){
    return (
      <div className="container gallery-container">
          <h1 className="page-description text-center">Photo Gallery</h1>
          <div className="tz-gallery">
            <div className="row">
               <ImageList images={this.state.images} />
            </div>
          </div>
      </div>
    );
  }
  
}


export default Gallery;
