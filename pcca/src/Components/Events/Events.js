import './Events.module.css';
import React from 'react';
import Auxilary from '../../hoc/Auxilary/Auxilary';
import axios from 'axios';

//https://aladhan.com/play/Vancouver/Canada



class Events extends React.Component{

    state = {
        prayerTimes : null,
		error: false
    }
    componentWillMount(){
		var d = new Date();
		var n = d.getDate();	
		axios.get('https://pcabc.ca/api/azan')
		.then(response=>{
			this.setState({prayerTimes: response.data.data[n].timings});
		  }).catch(error=>{this.setState({error:true})});		   
	
	};

	render (){
		
		if (this.state.prayerTimes){
			const prayer = {...this.state.prayerTimes};
			const pray = [];
			for(let key in prayer){
				pray.push({
					prayer: key,
					timing: prayer[key]
				})
			}; 
			

			var ingOutput=pray.map(ig=>{
				return	(<tr key={ig.prayer}>
							<td>{ig.prayer}</td>
							<td>{ig.timing}</td>
						</tr>)
			});





		}


  


		return (

			<Auxilary>
					
					<div className="sidebar-widget">
						<h3 className="sidebar-title">BC Prayer Times</h3>
						<div className="widget-container widget-about">
							<a href="post.html"><img src="https://shawglobalnews.files.wordpress.com/2018/08/img-2941-e1533664467170.jpg?quality=70&strip=all&w=720&h=379&crop=1" alt=""/></a>						
     						<table className="table table-striped">
									<thead>
										<tr>
										   <th scope="col">Prayer</th>
										   <th scope="col">Timing</th>
										</tr>
									</thead>
									<tbody>
										{ingOutput}
									</tbody>
							</table>
									
							</div>
					</div>

					<div className="sidebar-widget">
							<h3 className="sidebar-title">Featured Posts</h3>
							<div className="widget-container">
								<article className="widget-post">
									<div className="post-image">
										<a href="post.html"><img src="images/90x60-1.jpg" alt=""/></a>
									</div>
									<div className="post-body">
										<h2><a href="post.html">The State of the Word 2014</a></h2>
										<div className="post-meta">
											<span><i className="fa fa-clock-o"></i> 2. august 2015</span> <span><a href="post.html"><i className="fa fa-comment-o"></i> 23</a></span>
										</div>
									</div>
								</article>

								<article className="widget-post">
									<div className="post-image">
										<a href="post.html"><img src="images/90x60-1.jpg" alt=""/></a>
									</div>
									<div className="post-body">
										<h2><a href="post.html">The State of the Word 2014</a></h2>
										<div className="post-meta">
											<span><i className="fa fa-clock-o"></i> 2. august 2015</span> <span><a href="post.html"><i className="fa fa-comment-o"></i> 23</a></span>
										</div>
									</div>
								</article>
								
							</div>
							
						</div>

				</Auxilary>




			);
	}
}

export default Events;