import './Events.module.css';
import React from 'react';
import Auxilary from '../../hoc/Auxilary/Auxilary'


class Events extends React.Component{

	render (){
		return (

			<Auxilary>

					<div className="sidebar-widget">
						<h3 className="sidebar-title">About Me</h3>
						<div className="widget-container widget-about">
							<a href="post.html"><img src="images/author.jpg" alt=""/></a>
							<h4>Jamie Mooz</h4>
							<div className="author-title">Designer</div>
							<p>While everyone’s eyes are glued to the runway, it’s hard to ignore that there are major fashion moments on the front row too.</p>
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