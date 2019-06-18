import './Gallery.module.css';
import React from 'react';
import ImageCard from './ImageCard';

const ImageList = (props) => {
   const images = props.images.map((image) => {
     return <ImageCard key={image.gallery_ID} image={image} />;
   });
   
   return <div className="tz-gallery"><div className="row"> {images} </div></div>;
};

export default ImageList;