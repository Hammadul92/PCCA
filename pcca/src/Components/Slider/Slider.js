import React  from 'react';
import Auxilary from '../../hoc/Auxilary/Auxilary';
import './styles.css';

class ControlledCarousel extends React.Component {
  
    render() {

  
      return (
          <Auxilary>
        <div className='slider'>
              <div id="myCarousel" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                  <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
                  <li data-target="#myCarousel" data-slide-to="1"></li>
                  <li data-target="#myCarousel" data-slide-to="2"></li>
                </ol>

                <div className="carousel-inner">
                  <div className="item active">
                    <img className='image' src="https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2012/03/pakistan-flag.jpg" alt="Los Angeles" width='100%'/>
                  </div>

                  <div className="item">
                    <img className='image' src="https://article.images.consumerreports.org/prod/content/dam/CRO%20Images%202018/Cars/November/CR-Cars-InlineHero-2019-Honda-Insight-driving-trees-11-18" alt="Chicago" width='100%'/>
                  </div>

                  <div className="item">
                    <img className='image' src="https://production-354f.kxcdn.com/wp-content/uploads/sites/66/2017/11/Perfect-car_-front-view-1206x602.jpg" alt="New York" width='100%'/>
                  </div>
                </div>

                <a className="left carousel-control" href="#myCarousel" data-slide="prev">
                  <span className="glyphicon glyphicon-arrow-left"></span>
                  <span className="sr-only">Previous</span>
                </a>
                <a className="right carousel-control" href="#myCarousel" data-slide="next">
                  <span className="glyphicon glyphicon-arrow-right">asdd</span>
                  <span className="sr-only">Next</span>
                </a>
              </div>
        </div>

        </Auxilary>
      );
    }
  }
  
  export default (ControlledCarousel)