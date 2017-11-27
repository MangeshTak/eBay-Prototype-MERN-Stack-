import React, { Component } from 'react';
import {connect} from 'react-redux';
import './bookedComponent.css';
import { Modal } from 'react-bootstrap';
import * as Profiles from '../../../../api/profile'

class BookedComponent extends Component {

    constructor(props){
        super(props) ;

        this.state = {
            openBookingDetailModal : false ,
            bookingDetails : ''
        }

        this.getBillingDetails = this.getBillingDetails.bind(this) ;
        this.openBillingModal = this.openBillingModal.bind(this);
        this.closeBillingModal = this.closeBillingModal.bind(this);
    }


    openBillingModal(){
        this.setState({ openBookingDetailModal : true })
    }

    closeBillingModal(){
        this.setState({ openBookingDetailModal : false })
    }


    getBillingDetails(){
        var _this = this ;
        Profiles.getBookingDetailsById(this.props.data.bookingId , function(err , response){
            if(!err){
                response.then(res => {
                    _this.setState({bookingDetails : res.data})
                })
            }
        })
    }

    render() {
    	console.log("Booking data " , this.state.bookingDetails.bookingInfo) ; 
        return (
			<div className="past-booking-content-list">
				<div className="col-md-3 col-lg-3 col-sm-3 col-xs-3">
                    {this.props.data.bookingId}
				</div>
				<div className="col-md-2 col-sm-2 col-lg-2 col-xs-2">
                    {this.props.data.listingType}
				</div>
				<div className="col-md-2 col-sm-2 col-lg-2 col-xs-2">
                    {(this.props.data.createdDate).toString().substr(0,10)}
				</div>
				<div className="col-md-2 col-sm-2 col-lg-2 col-xs-2">
					${this.props.data.totalAmount}
				</div>
				<div className="col-md-3 col-sm-3 col-lg-3 col-xs-3 text-center">
					<a href="javascript:void(0)" onClick={this.openBillingModal}>View</a>
				</div>
				<div className="clearfix"></div>

				<Modal show={this.state.openBookingDetailModal}  onEntered={this.getBillingDetails} id="carModal" className="profileModal booking-detail-modal">

					<Modal.Body>

                        {
                            this.state.bookingDetails.date !== undefined ?

								<div className="booking-panel-body-component">

									<div className="row single-price-component">
										<div className=" fair-type-div col-xs-7 pull-left">
											<div className="fair-type">
												<span >Booking ID</span>
											</div>

										</div>
										<div className="fair-type-price col-xs-5 pull-right">
											<div className="fair-type">
												<span className="price">{this.state.bookingDetails.bookingId}</span>
											</div>
										</div>
									</div>

									<div className="row single-price-component">
										<div className=" fair-type-div col-xs-7 pull-left">
											<div className="fair-type">
												<span >Booking-Type</span>
											</div>

										</div>
										<div className="fair-type-price col-xs-5 pull-right">
											<div className="fair-type">
												<span className="price">{this.state.bookingDetails.commodity}</span>
											</div>
										</div>
									</div>

									

									<div className="row single-price-component">
										<div className=" fair-type-div col-xs-7 pull-left">
											<div className="fair-type">
												<span >Booking Date</span>
											</div>

										</div>
										<div className="fair-type-price col-xs-5 pull-right">
											<div className="fair-type">
												<span className="price">{ (this.state.bookingDetails.date).toString().substr(0,10)}</span>
											</div>
										</div>
									</div>

									<div className="row single-price-component">
										<div className=" fair-type-div col-xs-7 pull-left">
											<div className="fair-type">
												<span >Amount</span>
											</div>

										</div>
										<div className="fair-type-price col-xs-5 pull-right">
											<div className="fair-type">
												<span>${this.state.bookingDetails.amount}</span> 
											</div>
										</div>
									</div>
									
									<div className="header-additional-info">
										<h3>Booking Information</h3>
									</div>

									{
										this.state.bookingDetails.commodity === "flights" ?
										<div>
											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >Source</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.source}</span> 
													</div>
												</div>
											</div>

											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >Destination</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.dest}</span> 
													</div>
												</div>
											</div>


											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >Airline</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.flightName}</span> 
													</div>
												</div>
											</div>

											


											{
													this.state.bookingDetails.bookingInfo.travelerInfo.map((traveller , key) => {
														return <div key={key} className="row travellers-info">
																	<div className="col-xs-4 pull-left">
																		Traveller #{key+1}
																	</div>
																	<div className="col-xs-8 ">
																		<span className="pull-right">{traveller.firstName} {traveller.lastName}</span>
																	</div>
																</div>
														})

											}

											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >Email</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.emailAddress}</span> 
													</div>
												</div>
											</div>	

											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >Contact</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.phoneNumber}</span> 
													</div>
												</div>
											</div>


										</div>

										:
										<div>
										</div>
									}
									


									{
										this.state.bookingDetails.commodity === "cars" ?
											
										<div>
											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >City</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.city}</span> 
													</div>
												</div>
											</div>

											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >Start Date</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.startDate}</span> 
													</div>
												</div>
											</div>


											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >End Date</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.endDate}</span> 
													</div>
												</div>
											</div>

											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >Car Name</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.carName}</span> 
													</div>
												</div>
											</div>

											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >Name</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.firstName} {this.state.bookingDetails.bookingInfo.lastName} </span> 
													</div>
												</div>
											</div>


											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >License #</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.licenseNumber}</span> 
													</div>
												</div>
											</div>

											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >Contact Email</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.email}</span> 
													</div>
												</div>
											</div>

											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >Contact Number</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.phoneNumber}</span> 
													</div>
												</div>
											</div>

										</div>


										:
										<div>
										</div>

									}



									

									{
										this.state.bookingDetails.commodity === "hotels" ?
											
										<div>
											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >City</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.city}</span> 
													</div>
												</div>
											</div>

											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >Check-in Date</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.checkInDate}</span> 
													</div>
												</div>
											</div>


											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >Check-out Date</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.checkOutDate}</span> 
													</div>
												</div>
											</div>

											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >Hotel Name</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.hotelName}</span> 
													</div>
												</div>
											</div>

											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >Room Type</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.roomType}  </span> 
													</div>
												</div>
											</div>


											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >No of Guest</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.guests}</span> 
													</div>
												</div>
											</div>

											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >Name</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.firstName} {this.state.bookingDetails.bookingInfo.lastName}</span> 
													</div>
												</div>
											</div>

											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >Email</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.email}</span> 
													</div>
												</div>
											</div>


											<div className="row single-price-component">
												<div className=" fair-type-div col-xs-7 pull-left">
													<div className="fair-type-add-info">
														<span >Contact</span>
													</div>

												</div>
												<div className="fair-type-price col-xs-5 pull-right">
													<div className="fair-type-add-info">
														<span>{this.state.bookingDetails.bookingInfo.phoneNumber}</span> 
													</div>
												</div>
											</div>

										</div>


										:
										<div>
										</div>

									}
                                  


								</div>

                                :

								<div></div>
                        }

					</Modal.Body>

					<Modal.Footer>
						<button className="btn btn-default btn-kayak btn-kayak-default" onClick={this.closeBillingModal}>Close</button>
					</Modal.Footer>

				</Modal>
			</div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(BookedComponent);
