import React from 'react';
import classes from './Profile.module.css';

import { connect } from 'react-redux';

class Profile extends React.Component{

    render(){
        var sign = null;
        if(this.props.state){
            sign = this.props.state.user
        }
        else{
            sign = 'Please Log in'
        }

    return(
        <div>
             <h1 className={classes.h1}></h1>
             <p>{sign}</p>
        </div>

    );

    }
};

const mapStateToProps = state => {
	console.log(state);
	return{
  
	    state: state
	    
	}
  };

export default connect(mapStateToProps)(Profile);

