import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import queryString from 'query-string';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import Autocomplete from 'react-autocomplete';
import './flightsSearchForm.css';
import * as analytics from '../../../../actions/analytics';

class FlightsSearchForm extends Component {

	constructor(props) {
		super(props);
		const queryParams = queryString.parse(decodeURI(this.props.location.search));
        this.state = {
            source:queryParams.source ? queryParams.source:'',
            dest:queryParams.dest ? queryParams.dest:'',
            date:queryParams.date ? moment(queryParams.date,"MM-DD-YYYY"):moment(),
            cabin:queryParams.cabin ? queryParams.cabin:'Economy',
            travelers:queryParams.travelers ? queryParams.travelers:1,
            sourceSearch:queryParams.source ? queryParams.source:'',
            destSearch:queryParams.dest ? queryParams.dest:''
        }
		this.search = this.search.bind(this);
  	}

		trackClick(click, page) {
				var payload = {'click' : click, 'page' : page};
				this.props.trackClick(payload);
		}

    handleSourceChange(val,item){
        this.setState({
            sourceSearch:item.city+', '+item.state,
            source:item.city+', '+item.state
        });
    }

    handleSourceSearchChange(e,val){
        this.setState({
            sourceSearch: val,
            source:''
        });
    }

    handleDestChange(val,item){
        this.setState({
            destSearch:item.city+', '+item.state,
            dest:item.city+', '+item.state
        });
    }

    handleDestSearchChange(e,val){
        this.setState({
            destSearch: val,
            dest:''
        });
    }

    handleDateChange(date){
        this.setState({
            date: date
        });
    }

    handleCabinChange(cabin){
        this.setState({
            cabin: cabin
        });
    }

    handleTravelersChange(e){
        this.setState({
            travelers: e.target.value
        });
    }

	search() {
				this.trackClick('flights-search', '/flights/listings')
        if(this.state.source === ''){
            alert("Please select source city!");
            return;
        }
        if(this.state.dest === ''){
            alert("Please select destination city!");
            return;
        }
        this.props.history.push('/flights/listings?source='+this.state.source+'&dest='+this.state.dest+'&date='+moment(this.state.date).format('MM-DD-YYYY')+'&travelers='+this.state.travelers+'&cabin='+this.state.cabin);
	}

  	render() {
        var options = this.props.cities;
	  	return (
	      	<div className="form-container flight-search-form-container">
	        	<div className="form-body">
	        		<div className="button-col">
	        			<button className="btn btn-primary btn-kayak" onClick={this.search}>
	        				<i className="fa fa-long-arrow-right fa-2x" aria-hidden="true"></i>
	        			</button>
	        		</div>
	        		<div className="fields-col">
	        			<div className=" field-container source">
                            <label>Source</label>
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
                                value={this.state.sourceSearch}
                                onChange={this.handleSourceSearchChange.bind(this)}
                                onSelect={this.handleSourceChange.bind(this)}
                                renderMenu={children => (
                                    <div className="menu">
                                        {children}
                                    </div>
                                )}
                                selectOnBlur={true}
                            />
	        			</div>
	        			<div className="field-container destination">
                            <label>Destination</label>
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
                                value={this.state.destSearch}
                                onChange={this.handleDestSearchChange.bind(this)}
                                onSelect={this.handleDestChange.bind(this)}
                                renderMenu={children => (
                                    <div className="menu">
                                        {children}
                                    </div>
                                )}
                                selectOnBlur={true}
                            />
	        			</div>
	        			<div className="field-container date">
                            <label>Date of travel</label>
                            <DatePicker className="form-control" readOnly={true}
                                        minDate={moment()}
                                        selected={this.state.date}
                                        onChange={this.handleDateChange.bind(this)}
                            />
	        			</div>
	        			<div className="field-container travelers">
                            <label>No of travelers</label>
                            <input type="number" min="1" className="form-control"
                                   value={this.state.travelers} onChange={this.handleTravelersChange.bind(this)}/>
	        			</div>
	        		</div>
                    <div className="footer-row">
                        <label>Cabin class: </label>
                        <div className="radio-options">
                            <label className="radio-inline">
                                <input type="radio" name="cabin"
                                       value="Economy" checked={this.state.cabin === 'Economy'}
                                       onChange={this.handleCabinChange.bind(this,'Economy')}/>
                                Economy
                            </label>
                            <label className="radio-inline">
                                <input type="radio" name="cabin"
                                       value="Business" checked={this.state.cabin === 'Business'}
                                       onChange={this.handleCabinChange.bind(this,'Business')}/>
                                Business
                            </label>
                            <label className="radio-inline">
                                <input type="radio" name="cabin"
                                       value="First" checked={this.state.cabin === 'First'}
                                       onChange={this.handleCabinChange.bind(this,'First')}/>
                                First
                            </label>
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

export default withRouter(connect(mapStateToProps , mapDispatchToProps )(props => <FlightsSearchForm {...props}/>));
