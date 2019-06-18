
import React from 'react';
import News from './News/News';
import Events from './Events/Events';
import './App.css';

class Home extends React.Component{
    state = {
        loggedin: false,
        token: null
    }


    ComponentWillMount(){
        //CREATEING TOKEN//
        console.log('HOME')

    }



    render(){
        return (
            <div className="container">
                <section>
                    <div className="row">
                        <div className="col-md-8"><News /></div>
                        <div className="col-md-4 sidebar-gutter">
                            <Events />
                        </div>
                    </div>
                </section>

            </div>
        );
    }
}

export default Home;