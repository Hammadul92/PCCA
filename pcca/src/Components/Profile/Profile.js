import React from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import axios from 'axios';

class Profile extends React.Component{

  state = {
      user: this.props.state.user,
      firstname: this.props.state.firstname,
      lastname: this.props.state.lastname,
      phone: this.props.state.phone,
  }


  updateFormHandler = (event) => {
    event.preventDefault();
    const data = {
      userID: this.props.state.userID,
      email: this.state.user,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      phone: this.state.phone,
      token: this.props.state.token
    };

    

    var request = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:5000/updateProfile",
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Cache-Control": "no-cache",
        "Host": "localhost:5000",
        "accept-encoding": "gzip, deflate",
        "Connection": "keep-alive",
        "cache-control": "no-cache",
        "Authorization": "Bearer " + this.props.state.token
      },
      "processData": false,
      "data": data
  
      };

      axios(request).then(response => {
       this.props.flash(response.data.msg);
       this.props.updated(data);

          }).catch(error=> {
      
      });

  }

    render(){

        var msg = <div className="msg"> {this.props.state.message}</div>;
        

        if(this.props.state.loggedin){
            return(
                    <div className="container">
                         <h1 className="text-center margin-top"> My Profile </h1>
                         {msg}
                         <form className="LoginForm row" onSubmit={(event) => this.updateFormHandler(event)}>
                            <div className="col-md-6 col-md-offset-3">
                               <div className="row">
                                   <div className="col-md-6 form-group">
                                     <label> Email </label>
                                     <input type="text" value={this.state.user} onChange={(event)=>this.setState({user: event.target.value})} required/>
                                   </div>
                                   <div className="col-md-6 form-group">
                                     <label> Phone Number </label>
                                     <input type="text" value={this.state.phone} onChange={(event)=>this.setState({phone: event.target.value})} required/>
                                   </div>
                                   <div className="col-md-6 form-group">
                                     <label> First Name </label>
                                     <input type="text" value={this.state.firstname} onChange={(event)=>this.setState({firstname: event.target.value})} required/>
                                   </div>
                                   <div className="col-md-6 form-group">
                                     <label> Last Name </label>
                                     <input type="text" value={this.state.lastname} onChange={(event)=>this.setState({lastname: event.target.value})} required/>
                                   </div>
                                   <div className="col-md-12 form-group">
                                     <button className="btn" type="submit"> Update </button>
                                   </div>
                                </div>
                            </div>
                         </form>
                    </div>
            );
        }else{
            return (
              <div className="container text-center margin-bottom ">
                 <h1> Please login to view your profile. </h1>
                 <a href="/login" className="btn">Login</a>
                 <a href="/signup" className="btn">Register</a>
              </div>
            )
        }

 
    }
        
};





const mapStateToProps = state => {
	return{ 
	    state: state	    
	}
};

const mapDispatchToProps = dispatch =>{  

    return{
        flash: (msg) => dispatch({type: actionTypes.FLASH_MESSAGE, message:msg}),
        updated: (data) => dispatch({type: actionTypes.UPDATE_USER, payload: data})    
    }

};




export default connect(mapStateToProps,mapDispatchToProps)(Profile);

