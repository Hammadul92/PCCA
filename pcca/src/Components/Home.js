
import React from 'react';
import News from './News/News';
import Events from './Events/Events';
import Gallery from './Gallery/Gallery';
import './App.css';
import axios from 'axios';




class Home extends React.Component{


 
        state = {
            images: [],
            error: false,
            isLoaded: false,
        
          }
          UNSAFE_componentWillMount(){
    
              
              axios.get('https://www.pakcan.com/api/gallery').then(response=>{
                var arr=[];
                for (var key in response.data.images) {
                  arr.push(response.data.images[key]);
                 // console.log(response.data.images[key]);
                }
              this.setState({images: arr});

    
              }).catch(error=>{this.setState({error:true})});
              
        
          };
          
          
          componentWillUpdate(nextProps, nextState) {
             if (nextState.images.length>0 && !nextState.isLoaded)
             {
              console.log(nextProps, nextState);
              this.setState({isLoaded: true});
            }
          }

    render(){

        let gal,gal1,gal2,gal3,gal4,gal5,gal6,gal7 = null;

        if (this.state.isLoaded){
            let l = this.state.images.length;
            //console.log(this.state.images.length - 1);
            gal = (<img src={this.state.images[l-8].img_url} alt="img" className="img-responsive" /> );
            gal1 = (<img src={this.state.images[l-1].img_url} alt="img" className="img-responsive" /> );
            gal2 = (<img src={this.state.images[l-2].img_url} alt="img" className="img-responsive" /> );
            gal3 = (<img src={this.state.images[l-3].img_url} alt="img" className="img-responsive" /> );
            gal4 = (<img src={this.state.images[l-4].img_url} alt="img" className="img-responsive" /> );
            gal5 = (<img src={this.state.images[l-5].img_url} alt="img" className="img-responsive" /> );
            gal6 = (<img src={this.state.images[l-6].img_url} alt="img" className="img-responsive" /> );
            gal7 = (<img src={this.state.images[l-7].img_url} alt="img" className="img-responsive" /> );
 
        }

        // if (this.state.isLoaded){
        console.log('LOG IMAGES',this.state.images.length)
        // }

        return (
            <div>
                
                <div className="container">
                    <div className="slider-area">
                        <div className="slider-wrapper owl-carousel">
                            <div className="slider-item text-center home-one-slider-otem slider-item-four slider-bg-one">
                                <div className="container">
                                    <div className="row">
                                        <div className="slider-content-area">
                                            <div className="slide-text">                                
                                                <img src="logo.jpg"  className="image" />
                                                <h1 className="homepage-three-title"> One Choice. <span> Global Impact </span></h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="slider-item text-center home-one-slider-otem slider-item-four slider-bg-two">
                                <div className="container">
                                    <div className="row">
                                        <div className="slider-content-area">
                                            <div className="slide-text">                                
                                                <img src="logo.jpg" className="image" />
                                                <h1 className="homepage-three-title"> One Choice. <span> Global Impact </span></h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="container">
                    <div className="row">                       
                        <div className=" col-md-8"><News /></div>
                        <div className="col-md-4 sidebar-gutter">
                            <Events />
                        </div>
                    </div>
                </section>

                <section className="container">
                <div className="owl-carousel why-we-matter"> 
                    <div className="item-carousel">
                        {gal}
                    </div> 
                    <div className="item-carousel">
                        {gal1}
                    </div> 
                    <div className="item-carousel">
                        {gal2}
                    </div> 
                    <div className="item-carousel">
                        {gal3}
                    </div> 
                    <div className="item-carousel">
                        {gal4}
                    </div> 
                    <div className="item-carousel">
                        {gal5}
                    </div> 
                    <div className="item-carousel">
                        {gal6}
                    </div> 
                    <div className="item-carousel">
                        {gal7}
                    </div> 
                </div>

                   
                
                 </section>


            </div>
        );
    }

    // componentDidUpdate() {
    //     console.log('DID update',this.state.images.length);
    //     if (!this.state.isLoaded)
    //         this.setState({isLoaded: true});

    // }
}



export default (Home);