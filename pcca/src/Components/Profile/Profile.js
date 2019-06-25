import React from 'react';
import { connect } from 'react-redux';

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
                                 <input type="text" Value={this.props.state.user} />
                               </div>
                               <div className="col-md-6 form-group">
                                 <label> Phone Number </label>
                                 <input type="text" Value={this.props.state.user} />
                               </div>
                               <div className="col-md-6 form-group">
                                 <label> First Name </label>
                                 <input type="text" Value="First Name" />
                               </div>
                               <div className="col-md-6 form-group">
                                 <label> Last Name </label>
                                 <input type="text" Value="Last Name" />
                               </div>
                               <div className="col-md-12 form-group">
                                 <button className="btn"> Update </button>
                               </div>
                            </div>
                        </div>
                     </div>
                </div>

            ); 
        }
        else{
            location.href = '/login';
            this.props.state.message = "Please login to access your profile.";
        }

        

    }
};




const mapStateToProps = state => {
	return{ 
	    state: state	    
	}
  };

export default connect(mapStateToProps)(Profile);

