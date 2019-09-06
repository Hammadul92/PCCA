import React from 'react';
import ImageList from './imageList';
import axios from 'axios';

class Gallery extends React.Component{
  state = {
    images: [],
    error: false
  }

  UNSAFE_componentWillMount(){
      
      axios.get('http://localhost:5000/gallery').then(response=>{
      this.setState({images: response.data.images});
      }).catch(error=>{this.setState({error:true})});
      

  }

  render(){
    console.log(this.state.images.length);
    return (
     
      <div className="container">
          <h1 className="text-center">Photo Gallery</h1>
          <ImageList images={this.state.images} />
      </div>
    );
  }
  
}


export default Gallery;
