import React from 'react';
import gallery_api from './api/gallery_api';
import ImageList from './imageList';

class Gallery extends React.Component{
  state = {images: []}

  onSearchSubmit = async (term) => {
      const response = await gallery_api.get('/gallery', {
        params : {query: term},       
      });

      this.setState({images : response.data.results});
  }

  render(){
    return (
      <div className="tz-gallery">
        <div className="row">
           <ImageList images={this.state.images} />
        </div>
      </div>
    );
  }
  
}


export default Gallery;
