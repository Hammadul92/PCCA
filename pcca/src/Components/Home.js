
import React from 'react';
import Slider from './Slider/Slider';
import News from './News/News';
import Events from './Events/Events';
import './App.css';


class Home extends React.Component{
    state = {
        loggedin: false,
        token: null
    }

    render(){
        return (
            <div className="container">
            <Slider />
            <section>
                <div className="row">
                    <div className="col-md-8"><News /></div>
                    <div className="col-md-4 sidebar-gutter">
                        <Events />
                    </div>
                </div>
            </section>

            </div>
        )};
        }

export default Home;