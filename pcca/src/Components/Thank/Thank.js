import React from 'react';
import './Thank.module.css';
import Auxilary from '../../hoc/Auxilary/Auxilary';
import Card from 'react-bootstrap/Card'

const thank=()=>(

    <Auxilary>

        <div className="main-content">
        <i className="fa fa-check fa-5x main-content__checkmark" id="checkmark"></i><i className="site-header__title" data-lead-id="site-header-title">THANK YOU!</i>
            <br/>
            
            <p className="main-content__body" data-lead-id="main-content-body">Thanks a bunch for your purchase. Your invoice/reciept would be sent in an email to your provided email address.</p>
        </div>
</Auxilary>
);


export default thank;