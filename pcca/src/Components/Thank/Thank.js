import React from 'react';
import './Thank.module.css';
import Auxilary from '../../hoc/Auxilary/Auxilary';
import Card from 'react-bootstrap/Card'

const thank=()=>(

    <Auxilary>
        <Card bg="success" text="white" style={{ width: '25rem', marginTop: '80px' }}>
            <Card.Header>THANK YOU!</Card.Header>
            <Card.Body>
            <Card.Title>Success Card Title</Card.Title>
            <Card.Text>
                Some quick example text to build on the card title and make up the bulk
                of the card's content.
            </Card.Text>
            </Card.Body>
        </Card>

        <div className="main-content">
        <i className="fa fa-check fa-5x main-content__checkmark" id="checkmark"></i><i className="site-header__title" data-lead-id="site-header-title">THANK YOU!</i>
            <br/>
            
            <p className="main-content__body" data-lead-id="main-content-body">Thanks a bunch for your purchase. Your invoice/reciept would be sent in an email to your provided email address.</p>
        </div>
</Auxilary>
);


export default thank;