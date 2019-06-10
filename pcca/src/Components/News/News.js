import './News.module.css';
import Auxilary from '../../hoc/Auxilary/Auxilary';
import React from 'react';

class News extends React.Component{

	render (){
		return (
				<Auxilary>
					<article className="blog-post">
						<div className="blog-post-image">
							<a href="post.html"><img className="img-responsive" src="https://markallenassets.blob.core.windows.net/communitycare/2018/10/word-culture-spelt-out-on-map-600.jpg" alt="" /></a>
						</div>
						<div className="blog-post-body">
							<h2><a href="post.html">Vintage-Inspired Finds for Your Home</a></h2>
							<div className="post-meta"><span>by <a href="#">Jamie Mooze</a></span>/<span><i className="fa fa-clock-o"></i>March 14, 2015</span>/<span><i className="fa fa-comment-o"></i> <a href="#">343</a></span></div>
							<p>ew months ago, we found ridiculously cheap plane tickets for Boston and off we went. It was our first visit to the city and, believe it or not, Stockholm in February was more pleasant than Boston in March. It probably has a lot to do with the fact that we arrived completely unprepared. That I, in my converse and thin jacket, did not end up with pneumonia is honestly not even fair.</p>
							<div className="read-more"><a href="#">Continue Reading</a></div>
						</div>
					</article>

	

	            </Auxilary>
			);
	}
}

export default News;