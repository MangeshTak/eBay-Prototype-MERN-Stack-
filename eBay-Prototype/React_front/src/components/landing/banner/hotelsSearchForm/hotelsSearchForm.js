import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import queryString from 'query-string';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import Autocomplete from 'react-autocomplete';
import './hotelsSearchForm.css';
import * as analytics from '../../../../actions/analytics';

class HotelsSearchForm extends Component {
    constructor(props) {
        super(props);
        const queryParams = queryString.parse(decodeURI(this.props.location.search));
        this.state = {
            city:queryParams.city ? queryParams.city:'',
            checkInDate:queryParams.startDate ? moment(queryParams.startDate,"MM-DD-YYYY"):moment(),
            checkOutDate:queryParams.endDate ? moment(queryParams.endDate,"MM-DD-YYYY"):moment(),
            roomType:queryParams.roomType ? queryParams.roomType:'Standard',
            guests:queryParams.guests ? queryParams.guests:1,
            citySearch:queryParams.city ? queryParams.city:''
        }
        this.search = this.search.bind(this);
    }

		trackClick(click, page) {
				var payload = {'click' : click, 'page' : page};
				this.props.trackClick(payload);
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

    handleCheckInDateChange(date){
        this.setState({
            checkInDate: date,
            checkOutDate: this.state.checkOutDate < date ? date:this.state.checkOutDate
        });
    }

    handleCheckOutDateChange(date){
        this.setState({
            checkOutDate: date
        });
    }

    handleRoomTypeChange(type){
        this.setState({
            roomType: type
        });
    }

    handleGuestsChange(e){
        this.setState({
            guests: e.target.value
        });
    }

    search() {
				this.trackClick('hotels-search', '/hotels/listings');
        if(this.state.city === ''){
            alert("Please select city!");
            return;
        }
        this.props.history.push('/hotels/listings?city='+this.state.city+'&startDate='+moment(this.state.checkInDate).format('MM-DD-YYYY')+'&endDate='+moment(this.state.checkOutDate).format('MM-DD-YYYY')+'&guests='+this.state.guests+'&roomType='+this.state.roomType);
    }

    render() {
        var options = this.props.cities;
        return (
            <div className="form-container hotel-search-form-container">
                <div className="form-body">
                    <div className="button-col">
                        <button className="btn btn-primary btn-kayak" onClick={this.search}>
                            <i className="fa fa-long-arrow-right fa-2x" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div className="fields-col">
                        <div className="field-container location">
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
                            <label>Check-in date</label>
                            <DatePicker className="form-control" readOnly={true}
                                        minDate={moment()}
                                        selected={this.state.checkInDate}
                                        onChange={this.handleCheckInDateChange.bind(this)}
                            />
                        </div>
                        <div className="field-container date">
                            <label>Check-out date</label>
                            <DatePicker className="form-control" readOnly={true}
                                        minDate={this.state.checkInDate}
                                        selected={this.state.checkOutDate}
                                        onChange={this.handleCheckOutDateChange.bind(this)}
                            />
                        </div>
                        <div className="field-container guests">
                            <label>No of guests</label>
                            <input type="number" min="1" className="form-control"
                                   value={this.state.guests} onChange={this.handleGuestsChange.bind(this)}/>
                        </div>
                    </div>
                    <div className="footer-row">
                        <label>Room type: </label>
                        <div className="radio-options">
                            <label className="radio-inline">
                                <input type="radio" name="roomType"
                                       value="Standard" checked={this.state.roomType === 'Standard'}
                                       onChange={this.handleRoomTypeChange.bind(this,'Standard')}/>
                                Standard
                            </label>
                            <label className="radio-inline">
                                <input type="radio" name="roomType"
                                       value="Premium" checked={this.state.roomType === 'Premium'}
                                       onChange={this.handleRoomTypeChange.bind(this,'Premium')}/>
                                Premium
                            </label>
                            <label className="radio-inline">
                                <input type="radio" name="roomType"
                                       value="Honeymoon" checked={this.state.roomType === 'Honeymoon'}
                                       onChange={this.handleRoomTypeChange.bind(this,'Honeymoon')}/>
                                Honeymoon
                            </label>
                            <label className="radio-inline">
                                <input type="radio" name="roomType"
                                       value="Conference" checked={this.state.roomType === 'Conference'}
                                       onChange={this.handleRoomTypeChange.bind(this,'Conference')}/>
                                Conference Room
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
	return {
			cities:state.citiesReducer.cities
	};
}

function mapDispatchToProps(dispatch) {
    return {
        trackClick : (payload) => dispatch(analytics.trackClick(payload))
    };
}


export default withRouter(connect(mapStateToProps , mapDispatchToProps )(props => <HotelsSearchForm {...props}/>));
