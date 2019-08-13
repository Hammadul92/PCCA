import React from 'react';
import ImageList from './imageList';
import axios from 'axios'

class Gallery extends React.Component{
  state = {
    images: [],
    error: false
  }

  componentWillMount(){
      
      axios.get('https://www.pakcan.com/api/gallery').then(response=>{
      this.setState({images: response.data.images});
      }).catch(error=>{this.setState({error:true})});
      

  }


  render(){
    console.log(this.state.images);
    return (
     
      <div className="container">
          <h1 className="text-center">Photo Gallery</h1>
          <ImageList images={this.state.images} />
      </div>
    );
  }
  
}


export default Gallery;
