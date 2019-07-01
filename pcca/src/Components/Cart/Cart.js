
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

class Cart extends React.Component{

	contactDataHandler = (event) => {
		event.preventDefault();
		const data = {
			email: this.state.email,
			message: this.state.message,
			name: this.state.name
		};

		var contact = {
			"async": true,
			"crossDomain": true,
			"url": "http://localhost:5000/contact",
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
			"data": data
	
		  };

		  axios(contact).then(response => {
			 this.props.flash(response.data.msg);
          }).catch(error=> {
			
		  });

	}
	
	removeItem=(index)=>{
		var arr = this.props.state.tickets;
	    arr.splice(index, 1); 
		console.log(arr, 'INDEX', index);
		this.props.removed(arr);
	}

	render (){

		var items = null;
		let msg = null;
		if(this.props.state.tickets.length === 0){
			msg =  <p> You do not have any items in the cart!</p>
		};

        if(this.props.state.tickets.length >0){
            //console.log(this.props.state.tickets, 'CART Checkout')

            items = this.props.state.tickets.map((item,index) =>{
				return (
					<tr>
                    <td>{index}</td>
                    <td>{item.title}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
					<td><div className="input-group-btn" ><a className="btn" onClick={() => this.removeItem(index)} > Remove</a></div></td>

				    </tr>
				);
			});

        }
        

		return(
            <div className="container">
            
                
                <h1>Cart Items: </h1>
				{msg}
                <table className="table">
                    <thead>
                        <tr>
                        <th></th>
                        <th>Title</th>
                        <th>Quantity</th>
                        <th>Price</th>
						<th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
							{items}
                        
                    </tbody>
                    </table>
                
            </div>
			);
	}
}


const mapStateToProps = state => {
	return{ 
		state: state   
	}
  };

const mapDispatchToProps = dispatch =>{  

    return{
        removed: (newCart) => dispatch({type: actionTypes.REMOVE_CART, payload:newCart})
    
    }

};


export default connect(mapStateToProps,mapDispatchToProps)(Cart);