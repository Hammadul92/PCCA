import './Events.module.css';
import React from 'react';
import Auxilary from '../../hoc/Auxilary/Auxilary';
import axios from 'axios';
import Profile from '../Profile/Profile';
//https://aladhan.com/play/Vancouver/Canada



class Events extends React.Component{

    state = {
        prayerTimes : null,
		error: false,
		token: null
    }

    componentWillMount(){
		var d = new Date();
		var n = d.getDate();
	

		axios.get('http://api.aladhan.com/v1/calendarByCity', {
			params: {
			  city: 'Vancouver',
			  country: 'Canada',
			  month: d.getMonth(),
			  year: d.getFullYear()


			}
		  }).then(response=>{
			this.setState({prayerTimes: response.data.data[n].timings});
		  }).catch(error=>{this.setState({error:true})});



		 //ACCESS A PRIVATE ROUTE
		   
		  var test2 = {
			"async": true,
			"crossDomain": true,
			"url": "http://localhost:5000/userlogin",
			"method": "POST",
			"headers": {
			  "Content-Type": "application/json",
			  "Accept": "*/*",
			  "Cache-Control": "no-cache",
			  "Host": "localhost:5000",
			  "accept-encoding": "gzip, deflate",
			  "Connection": "keep-alive",
			  "cache-control": "no-cache"
			},
			"processData": false,
			"data": "{\n    \"username\": \"info@pcca.com\",\n    \"password\": \"paklah92\"\n}"
	
		  }

 
		   axios(test2)
		   .then(response => {
			 console.log(response.data.access_token);
			 if (response.data.access_token){
				this.setState({token: response.data.access_token});
			 }
			 
		   })
		   .catch(error=> {
			 console.log(error);
		   });

		   

	
	};

	
	




	render (){
		
		if (this.state.prayerTimes){
			const prayer = {...this.state.prayerTimes};
			
			//console.log(Object.entries(prayer));

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

		console.log(this.state.token);
		


  


		return (

			<Auxilary>
					
					<div className="sidebar-widget">
						<h3 className="sidebar-title">BC Prayer Times</h3>
						<div className="widget-container widget-about">
							<a href="post.html"><img src="https://shawglobalnews.files.wordpress.com/2018/08/img-2941-e1533664467170.jpg?quality=70&strip=all&w=720&h=379&crop=1" alt=""/></a>
							
								<table className="table table-dark" styles={'text-align: centre'}>
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
								<Profile name={this.state.token}/>
								
							</div>
							
						</div>

				</Auxilary>




			);
	}
}

export default Events;