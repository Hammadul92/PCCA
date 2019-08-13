
import React from 'react';
import News from './News/News';
import Events from './Events/Events';
import Gallery from './Gallery/Gallery';
import './App.css';




//import * as actionTypes from '../../store/actions';


class Home extends React.Component{


    render(){
        //console.log('MAP TO Props TEST',this.props.test);

        return (
            <div>
                <div className="container">
                    <div className="slider-area">
                        <div className="slider-wrapper owl-carousel">
                            <div className="slider-item text-center home-one-slider-otem slider-item-four slider-bg-one">
                                <div className="container">
                                    <div className="row">
                                        <div className="slider-content-area">
                                            <div className="slide-text">                                
                                                <img src="logo.jpg"  className="image" />
                                                <h1 className="homepage-three-title"> One Choice. <span> Global Impact </span></h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="slider-item text-center home-one-slider-otem slider-item-four slider-bg-two">
                                <div className="container">
                                    <div className="row">
                                        <div className="slider-content-area">
                                            <div className="slide-text">                                
                                                <img src="logo.jpg" className="image" />
                                                <h1 className="homepage-three-title"> One Choice. <span> Global Impact </span></h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


               
                <section className="container">
                    <div className="owl-carousel why-we-matter">
                        <div className="item-carousel">
                           <img src="https://naturallysplendid.com/static/media/shutterstock1.jpg" alt="img" className="img-responsive" />                                                           
                        </div>  
                        <div className="item-carousel">
                           <img src="https://scontent.fyvr3-1.fna.fbcdn.net/v/t1.0-9/44063085_2178430772169482_3677718029560446976_o.jpg?_nc_cat=107&_nc_oc=AQmrAOeOdeKLeXD2gdqv2LQlxw41YFDy6vYByVJSrRZOa0aXHbA-clE6IMIzp0oqDDE&_nc_ht=scontent.fyvr3-1.fna&oh=cb5c3c85f6faade318617f906c8c2ba1&oe=5DB53E09" alt="img" className="img-responsive" />                                                           
                        </div>               
                     </div>
                </section>

                <section className="container">
                    <div className="row">                       
                        <div className=" col-md-8"><News /></div>
                        <div className="col-md-4 sidebar-gutter">
                            <Events />
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}



export default (Home);