import React, { Component } from 'react';
import 'react-rater/lib/react-rater.css';
import './carRow.css';

class CarRow extends Component {

    render() {
        return (
            <div className="cars-row">
                <div className="info-section">
                    <div className="divForImageAndName row">
                        <div className="carName-category col-lg-7 col-md-7 col-sm-7 col-xs-7">
                            <div className="category-section">
                                {this.props.data.carType}
                            </div>
                            <div>{this.props.data.carName} or Similar</div>
                            <div className="excess-info-text">
                                <span className="occupancy"><i className="fa fa-user fa-lg userFont" aria-hidden="true"></i>{this.props.data.occupancy}</span>
                                <span className="luggage"><i className="fa fa-suitcase fa-lg suitcaseFont" aria-hidden="true"></i>{this.props.data.luggage}</span>
                                <span className="availableCars"><i className="fa fa-car fa-lg carFont" aria-hidden="true"></i>{this.props.data.carQuantity}</span>
                            </div>
                            <hr></hr>
                            <div className="specialRateButtonDiv">
                                <button className="btn btn-default specialRateButton">Special Rate</button>
                            </div>
                        </div>
                        <div className="carImageDiv col-lg-5 col-md-5 col-sm-5 col-xs-5">
                            <img className="carImage" src={ this.props.data.images.length > 0 ? this.props.data.images[0] : "/assets/images/car-placeholder.png" }
                                 alt="car image"/>
                        </div>
                    </div>
                </div>
                <div className="price-section">
                    <p>${this.props.data.dailyRentalValue}</p>
                    <button className="btn btn-primary btn-kayak" onClick={(id)=>this.props.onBookClick(this.props.data.id)}>Book</button>
                </div>
            </div>
        );
    }
}

export default CarRow;
