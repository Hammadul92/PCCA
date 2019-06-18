import React from 'react';
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
        <p>{sign}</p>
        </div>

    );

};


export default profile;