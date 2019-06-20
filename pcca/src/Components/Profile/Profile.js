import React from 'react';
import classes from './Profile.module.css';

const profile = (props) => {
    var sign = null;
    if(props.name){
        sign = props.name
    }
    else{
        sign = 'Please Log in'
    }

    return(
        <div>
             <h1 className={classes.h1}> Profile</h1>
             <p>{sign}</p>
        </div>

    );

};


export default profile;