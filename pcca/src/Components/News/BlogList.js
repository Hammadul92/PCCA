import './News.module.css';
import React from 'react';
import BlogCard from './BlogCard';

const BlogList = (props) => {
   const blogs = props.blogs.map((blog) => {
     return <BlogCard key={blog.blog_ID} blog={blog} />;
   });
   
   return <div> {blogs} </div>;
};

export default BlogList;