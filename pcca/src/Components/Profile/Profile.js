import React from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

class Profile extends React.Component{

    render(){
        if(this.props.state.loggedin){
            return(
                
                    <div className="container">
                         <h1 className="text-center margin-top"> My Profile </h1>
                         <div className="LoginForm row">
                            <div className="col-md-6 col-md-offset-3">
                               <div className="row">
                                   <div className="col-md-6 form-group">
                                     <label> Email </label>
                                     <input type="text" value={this.props.state.user} />
                                   </div>
                                   <div className="col-md-6 form-group">
                                     <label> Phone Number </label>
                                     <input type="text" value={this.props.state.phone} />
                                   </div>
                                   <div className="col-md-6 form-group">
                                     <label> First Name </label>
                                     <input type="text" value={this.props.state.firstname} />
                                   </div>
                                   <div className="col-md-6 form-group">
                                     <label> Last Name </label>
                                     <input type="text" value={this.props.state.lastname} />
                                   </div>
                                   <div className="col-md-12 form-group">
                                     <button className="btn"> Update </button>
                                   </div>
                                </div>
                            </div>
                         </div>
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



export default connect(mapStateToProps)(Profile);

