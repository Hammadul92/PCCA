import React from 'react';
import Auxilary from '../../hoc/Auxilary/Auxilary';
import './Gallery.module.css';

class Gallery extends React.Component{

 

    
    render(){
        function importAll(r) {
            let images = {};
            r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
            return images;
          }
          
          const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));
          
          <img src={images['doggy.png']} />
        return (

        <Auxilary>

        


    <div className="container gallery-container">


            <p className="page-description text-center">Photo Gallery</p>

        <div className="tz-gallery">

            <div className="row">

                    <div className="col-sm-6 col-md-4">
                        <a className="lightbox" href="https://s3-us-west-2.amazonaws.com/uw-s3-cdn/wp-content/uploads/sites/6/2017/11/04133712/waterfall.jpg">
                            <img src="https://s3-us-west-2.amazonaws.com/uw-s3-cdn/wp-content/uploads/sites/6/2017/11/04133712/waterfall.jpg" alt="Park"/>
                        </a>
                    </div>


                    <div className="col-sm-6 col-md-4">
                        <a className="lightbox" href="https://s3-us-west-2.amazonaws.com/uw-s3-cdn/wp-content/uploads/sites/6/2017/11/04133712/waterfall.jpg">
                            <img src="https://s3-us-west-2.amazonaws.com/uw-s3-cdn/wp-content/uploads/sites/6/2017/11/04133712/waterfall.jpg" alt="Park"/>
                        </a>
                    </div>
                    
                    <div className="col-sm-6 col-md-4">
                        <a className="lightbox" href="https://s3-us-west-2.amazonaws.com/uw-s3-cdn/wp-content/uploads/sites/6/2017/11/04133712/waterfall.jpg">
                            <img src="https://s3-us-west-2.amazonaws.com/uw-s3-cdn/wp-content/uploads/sites/6/2017/11/04133712/waterfall.jpg" alt="Park"/>
                        </a>
                    </div>

                    
                    <div className="col-sm-6 col-md-4">
                        <a className="lightbox" href="https://s3-us-west-2.amazonaws.com/uw-s3-cdn/wp-content/uploads/sites/6/2017/11/04133712/waterfall.jpg">
                            <img src="https://s3-us-west-2.amazonaws.com/uw-s3-cdn/wp-content/uploads/sites/6/2017/11/04133712/waterfall.jpg" alt="Park"/>
                        </a>
                    </div>
                    
                    <div className="col-sm-6 col-md-4">
                        <a className="lightbox" href="https://s3-us-west-2.amazonaws.com/uw-s3-cdn/wp-content/uploads/sites/6/2017/11/04133712/waterfall.jpg">
                            <img src="https://s3-us-west-2.amazonaws.com/uw-s3-cdn/wp-content/uploads/sites/6/2017/11/04133712/waterfall.jpg" alt="Park"/>
                        </a>
                    </div>
                    
                    <div className="col-sm-6 col-md-4">
                        <a className="lightbox" href="https://s3-us-west-2.amazonaws.com/uw-s3-cdn/wp-content/uploads/sites/6/2017/11/04133712/waterfall.jpg">
                            <img src="https://s3-us-west-2.amazonaws.com/uw-s3-cdn/wp-content/uploads/sites/6/2017/11/04133712/waterfall.jpg" alt="Park"/>
                        </a>
                    </div>
                    
                    


            </div>

        </div>

    </div>
     </Auxilary>


            )};
        }

export default Gallery;