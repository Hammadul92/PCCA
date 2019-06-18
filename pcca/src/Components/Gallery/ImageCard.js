import React from 'react';

class ImageCard extends React.Component{

	render(){
		return (
			<div className="col-sm-6 col-md-4">
			   <a className="lightbox" href={this.props.image.img_url}>
				   <img  alt={this.props.image.gallery_ID} src={this.props.image.img_url}/>
			   </a>
			</div>
		);
	}
}

export default ImageCard;


