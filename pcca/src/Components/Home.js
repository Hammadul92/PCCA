
import React from 'react';
import News from './News/News';
import Events from './Events/Events';
import './App.css';




//import * as actionTypes from '../../store/actions';


class Home extends React.Component{


    render(){
        //console.log('MAP TO Props TEST',this.props.test);

        return (
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


                <section>
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