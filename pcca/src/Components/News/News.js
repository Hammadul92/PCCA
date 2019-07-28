import React from 'react';
import BlogList from './BlogList';
import axios from 'axios';

class News extends React.Component{

  state = {
    blogs: [],
    error: false
  }

  componentWillMount(){
      
      //axios.get('http://localhost:5000:5000/blogs').then(response=>{
      axios.get('http://localhost:5000/blogs').then(response=>{
      this.setState({blogs: response.data.blogs});
      }).catch(error=>{this.setState({error:true})});

  }
  

  render (){
		return <BlogList blogs={this.state.blogs} />;
  }

}

export default News;