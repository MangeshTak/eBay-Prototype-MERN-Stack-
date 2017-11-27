import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './search.css';
import HotelsSearchForm from '../../landing/banner/hotelsSearchForm/hotelsSearchForm';
import FlightsSearchForm from '../../landing/banner/flightsSearchForm/flightsSearchForm';
import CarsSearchForm from '../../landing/banner/carsSearchForm/carsSearchForm';

class Search extends Component {

  	render() {
  		const category = this.props.match.params.category;
  		return (
      		<div className="inline-search">
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
    	);
  	}
}

export default withRouter(props => <Search {...props}/>);
