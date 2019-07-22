import React from 'react';
import './News.module.css';


const BlogCard = (props) => {
		return (

		   <article className="blog-post">
				<div className="blog-post-image">
					<a href="#"><img className="img-responsive" src={props.blog.img_url} alt={props.blog.blog_ID} /></a>
				</div>
				<div className="blog-post-body">
					<h2><a href="#">{props.blog.blog_topic}</a></h2>
					<div className="post-meta">
					       <span><i className="fa fa-clock-o"></i>{props.blog.date}</span>/
					       <span><i className="fa fa-eye"></i>{props.blog.visits}</span>
					</div>
					<p dangerouslySetInnerHTML={{ __html: props.blog.blog_desc }}  />		
					
					<hr/>
				</div>
		    </article>
			

		);
}

export default BlogCard;

        