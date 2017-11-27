import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './filters.css'
import CarFilters from './carFilters/carFilters';
import HotelFilters from './hotelFilters/hotelFilters';
import FlightFilters from './flightFilters/flightFilters';

class Filters extends Component {

    constructor(props){
        super(props) ;
        this.state = {
            category : this.props.match.params.category
        }
    }

    render() {
        return (
      		<div className="filters-content">
              <div className="title-section">
      				<span className="title">Filters</span>
      			</div>
                {
                    this.state.category === "cars" ? (
                        <CarFilters applyFilters={this.props.applyFilters} timestamp={this.props.timestamp}/>
                    ) : this.state.category === "flights" ? (
                        <FlightFilters applyFilters={this.props.applyFilters} timestamp={this.props.timestamp}></FlightFilters>
                    ) : (
                        <HotelFilters applyFilters={this.props.applyFilters} timestamp={this.props.timestamp}></HotelFilters>
                    )
                }
      		</div>
		);
  	}
}

export default withRouter(props => <Filters {...props}/>);
