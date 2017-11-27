import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import './banner.css';
import HotelsSearchForm from './hotelsSearchForm/hotelsSearchForm';
import FlightsSearchForm from './flightsSearchForm/flightsSearchForm';
import CarsSearchForm from './carsSearchForm/carsSearchForm';
import * as analytics from '../../../actions/analytics';

class Banner extends Component {

	trackClick(click, page) {
		var payload = {'click' : click, 'page' : page};
		this.props.trackClick(payload);
	}

  	render() {
  		const category = this.props.match.params.category;
	    return (
	      <div className="banner-section">
	        <div className="bg-wrapper"></div>
	        <div className="bg-overlay">
	        	<div className="bg-overlay-content">
	        		<div className="title-section">
	        			<h2>Search hundreds of travel sites at once</h2>
	        		</div>
	        		<div className="nav-section">
	        			<ul className="nav">
	  						<li className="nav-item" onClick={()=> {this.trackClick('hotels-search-banner', '/home')}}>
	  							<NavLink to="/hotels">
	  								Hotels
	  							</NavLink>
	  						</li>
	  						<li className="nav-item" onClick={()=> {this.trackClick('flights-search-banner', '/home')}}>
	  							<NavLink to="/flights">
	  								Flights
	  							</NavLink>
	  						</li>
	  						<li className="nav-item" onClick={()=> {this.trackClick('cars-search-banner', '/home')}}>
	  							<NavLink to="/cars">
	  								Cars
	  							</NavLink>
	  						</li>
	  					</ul>
	        		</div>
	        		<div className="form-section">
	        			{
	        				category === 'hotels' ? (
	        					<HotelsSearchForm/>
	        				) : category === 'flights' ? (
	        					<FlightsSearchForm/>
	        				) : (
	        					<CarsSearchForm/>
	        				)
	        			}
	        		</div>
	        	</div>
	        </div>
	      </div>
	    );
  	}
}

function mapStateToProps(state) {
    return {
		};
}

function mapDispatchToProps(dispatch) {
    return {
        trackClick : (payload) => dispatch(analytics.trackClick(payload))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(props => <Banner {...props}/>));
