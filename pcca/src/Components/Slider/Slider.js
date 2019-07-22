import React  from 'react';
import Auxilary from '../../hoc/Auxilary/Auxilary';
import './styles.css';
class ControlledCarousel extends React.Component {
  
    render() {

  
      return (
          <Auxilary>
   
               
                  <div className='slider' >
                    <img className='image' src="logo.jpg" alt="Los Angeles" />
                  </div>


    
        </Auxilary>
      );
    }
  }
  
  export default (ControlledCarousel)