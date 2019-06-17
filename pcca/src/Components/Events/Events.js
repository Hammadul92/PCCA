import './Events.module.css';
import React from 'react';
import Auxilary from '../../hoc/Auxilary/Auxilary';
import axios from 'axios';
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
		var tok = null;

		axios.get('http://api.aladhan.com/v1/calendarByCity', {
			params: {
			  city: 'Vancouver',
			  country: 'Canada',
			  month: d.getMonth(),
			  year: d.getFullYear()


			}
		  })
        .then(response=>{

			//console.log(response.data.data[n].timings);
			this.setState({prayerTimes: response.data.data[n].timings});
            //this.setState({ingredients: response.data});
		}).catch(error=>{this.setState({error:true})});

//CREATEING TOKEN//

        var test = {
	       "async": true,
	       "crossDomain": true,
	       "url": "http://localhost:5000/registration",
	       "method": "POST",
	       "headers": {
	       "Content-Type": "application/json",
	       "Accept": "*/*",
	       "Cache-Control": "no-cache",
	       "Host": "localhost:5000",
	       "accept-encoding": "gzip, deflate",
	       "content-length": "56",
	       "Connection": "keep-alive",
	       "cache-control": "no-cache"
	       },
	       "processData": false,
	       "data": "{\n    \"username\": \"2222111111122222\",\n    \"password\": \"test\"\n}"
         }
        
		  axios(test)
		  .then(response=> {
			console.log(response.data.access_token);
			//tok = response.data.access_token;
			this.setState({token: response.data.access_token})

			console.log(response.data.message);
		  })
		  .catch(error => {
			console.log(error);
		  });

		 //ACCESS A PRIVATE ROUTE
		 console.log(this.state.token);
		  var head = 'Bearer'.concat(this.state.token);
		   
		  
		  var test2 = {
			"async": true,
			"crossDomain": true,
			"url": "http://localhost:5000/secret",
			"method": "GET",
			"headers": {
			  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5Mzc0YTFkYS00ZmFkLTQ2MjMtOGVjZi01NGU1NmE4NTI3YjAiLCJleHAiOjE1NjA4MDM4NDEsImZyZXNoIjpmYWxzZSwiaWF0IjoxNTYwODAyOTQxLCJ0eXBlIjoiYWNjZXNzIiwibmJmIjoxNTYwODAyOTQxLCJpZGVudGl0eSI6IjIyMjIxMTExMTEyMjIyMiJ9.ef2eMcgRDF0vgw5L83NPrnwlKCb3KSZb3uCYgamUfdI",
			  "User-Agent": "PostmanRuntime/7.15.0",
			  "Accept": "*/*",
			  "Cache-Control": "no-cache",
			  "Postman-Token": "dac9e4d6-1b5b-477a-8576-f7ee5a8ad312,7de05038-50f6-4639-8177-db5c8c52c0f5",
			  "Host": "localhost:5000",
			  "accept-encoding": "gzip, deflate",
			  "Connection": "keep-alive",
			  "cache-control": "no-cache"
			}
		  }
 
		   axios(test2)
		   .then(response => {
			 console.log(response.data);
			 console.log(response.data.message);
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
		


  


		return (

			<Auxilary>
					
					<div className="sidebar-widget">
						<h3 className="sidebar-title">BC Prayer Times</h3>
						<div className="widget-container widget-about">
							<a href="post.html"><img src="https://shawglobalnews.files.wordpress.com/2018/08/img-2941-e1533664467170.jpg?quality=70&strip=all&w=720&h=379&crop=1" alt=""/></a>
							
								<table className="table table-dark" styles = {'text-align: centre'}>
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