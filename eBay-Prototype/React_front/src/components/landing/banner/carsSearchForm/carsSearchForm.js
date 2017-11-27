import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import queryString from 'query-string';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import Autocomplete from 'react-autocomplete';
import './carsSearchForm.css';
import * as analytics from '../../../../actions/analytics';

class CarsSearchForm extends Component {

    constructor(props) {
		super(props);
        const queryParams = queryString.parse(decodeURI(this.props.location.search));
        this.state = {
            city:queryParams.city ? queryParams.city:'',
            startDate:queryParams.startDate ? moment(queryParams.startDate,"MM-DD-YYYY"):moment(),
            endDate:queryParams.endDate ? moment(queryParams.endDate,"MM-DD-YYYY"):moment(),
            citySearch:queryParams.city ? queryParams.city:''
        }
		this.search = this.search.bind(this);
  }

	trackClick(click, page) {
			var payload = {'click' : click, 'page' : page};
			this.props.trackClick(payload);
	}

    handleStartDateChange(date){
        this.setState({
            startDate: date,
            endDate: this.state.endDate < date ? date:this.state.endDate
        });
    }

    handleEndDateChange(date){
        this.setState({
            endDate: date
        });
    }

    handleCityChange(val,item){
        this.setState({
            citySearch:item.city+', '+item.state,
            city:item.city+', '+item.state
        });
    }

    handleCitySearchChange(e,val){
        this.setState({
            citySearch: val,
            city:''
        });
    }

	search() {
    this.trackClick('cars-search', '/cars/listings')

		if(this.state.city === ''){
            alert("Please select city!");
            return;
        }
        this.props.history.push('/cars/listings?city='+this.state.city+'&startDate='+moment(this.state.startDate).format('MM-DD-YYYY')+'&endDate='+moment(this.state.endDate).format('MM-DD-YYYY'));
	}

  	render() {
        var options = this.props.cities;
        return (
	      	<div className="form-container car-search-form-container">
	        	<div className="form-body">
	        		<div className="button-col">
	        			<button className="btn btn-primary btn-kayak" onClick={this.search}>
	        				<i className="fa fa-long-arrow-right fa-2x" aria-hidden="true"></i>
	        			</button>
	        		</div>
	        		<div className="fields-col">
	        			<div className="field-container pickup">
							<label>City</label>
                            <Autocomplete
                                inputProps={{ className: 'form-control'}}
                                wrapperProps={{ className:'react-autocomplete' }}
                                wrapperStyle={{ position: 'relative', display: 'inline-block', width: '100%' }}
                                shouldItemRender={(item, value) =>
                                    value.length > 0 ? (item.city+', '+item.state).toLowerCase().indexOf(value.toLowerCase()) > -1 : false
                                }
                                getItemValue={(item) => item.city+', '+item.state}
                                items={options}
                                renderItem={(item, isHighlighted) =>
                                    <div className={`item ${isHighlighted ? 'item-highlighted' : ''}`} key={item.rank}>
                                        <p>{item.city}, {item.state}</p>
                                    </div>
                                }
                                value={this.state.citySearch}
                                onChange={this.handleCitySearchChange.bind(this)}
                                onSelect={this.handleCityChange.bind(this)}
                                renderMenu={children => (
                                    <div className="menu">
                                        {children}
                                    </div>
                                )}
                                selectOnBlur={true}
                            />
	        			</div>
	        			<div className="field-container date">
							<label>Pick-up date</label>
							<DatePicker className="form-control" readOnly={true}
                                        minDate={moment()}
										selected={this.state.startDate}
										onChange={this.handleStartDateChange.bind(this)}
							/>
	        			</div>
	        			<div className="field-container date">
							<label>Drop-off date</label>
							<DatePicker className="form-control" readOnly={true}
                                        minDate={this.state.startDate}
										selected={this.state.endDate}
										onChange={this.handleEndDateChange.bind(this)}
							/>
	        			</div>
	        		</div>
	        	</div>
	      	</div>
	    );
  	}
}


function mapDispatchToProps(dispatch) {
    return {
      trackClick : (payload) => dispatch(analytics.trackClick(payload))
    }
}

function mapStateToProps(state) {
    return {
        cities:state.citiesReducer.cities
    };
}

export default withRouter(connect(mapStateToProps , mapDispatchToProps )(props => <CarsSearchForm {...props}/>));
