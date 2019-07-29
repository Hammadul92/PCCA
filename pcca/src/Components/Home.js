
import React from 'react';
import News from './News/News';
import Events from './Events/Events';
import './App.css';
import ControlledCarousel from './Slider/Slider';




//import * as actionTypes from '../../store/actions';


class Home extends React.Component{


    render(){
        //console.log('MAP TO Props TEST',this.props.test);

        return (
            <div className="container">
                <ControlledCarousel/>
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