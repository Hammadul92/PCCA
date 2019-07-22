import React from 'react';
import './Spinner.module.css';
import Auxilary from '../../hoc/Auxilary/Auxilary';

const spinner=(props)=>(
    <Auxilary>
        <div className='heading'>
            {props.msg}
        </div>
        
        <div className='Loader'> Loading ... </div>

    </Auxilary>
    
    
);


export default spinner;