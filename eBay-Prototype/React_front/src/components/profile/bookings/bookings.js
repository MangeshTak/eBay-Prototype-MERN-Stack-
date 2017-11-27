import React, { Component } from 'react';
import {connect} from 'react-redux';
import './bookings.css';
import * as bookings from '../../../api/profile'
import BookedComponent from './bookedComponent/bookedComponent'

class Bookings extends Component {

	constructor(props){
		super(props) ;

		this.state = {
			bookingData : []
		}
	}

	componentDidMount(){
		var _this = this ; 
		bookings.getBookingDetails(function(err , response){
			if(err){
				console.log(err)
			}else{
				response.then(res => {
					_this.setState({bookingData : res.data})
				})
			}
		})
	}


    render() {
    	
    	const listOfBooking = this.state.bookingData.map((data, key) => {
    		return  <BookedComponent key={key} data={data}/> 
    	})

    	
        return (
            <div className="profile-panel bookings-page-wrapper">
                <div className="profile-panel-body">
                	<div className="row">
						<div className="col-xs-12 past-booking-header">
							<div className="col-md-3 col-lg-3 col-sm-3 col-xs-3">
								Booking ID
							</div>
							<div className="col-md-2 col-sm-2 col-lg-2 col-xs-2">
								 Category
							</div>
							<div className="col-md-2 col-sm-2 col-lg-2 col-xs-2">
								Booking Date
							</div>
							<div className="col-md-2 col-sm-2 col-lg-2 col-xs-2">
								Amount
							</div>
							<div className="col-md-3 col-sm-3 col-lg-3 col-xs-3">

							</div>
						</div>
						<div className="col-xs-12 past-booking-content">
                            {listOfBooking}
						</div>
                	</div>

                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(Bookings);