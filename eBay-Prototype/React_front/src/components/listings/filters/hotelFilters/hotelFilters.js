import React, { Component } from 'react';
import './hotelFilters.css';
import { withRouter } from 'react-router-dom';
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';
import {connect} from 'react-redux';
import * as hotelActions from '../../../../actions/hotel';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

class HotelFilters extends Component {


  constructor(props) {
      super(props);
      this.state = {
          rating:5,
          reviewScoreMin: 0,
          reviewScoreMax: 5,
          priceMin: 0,
          priceMax: 2000,
          amenities: []
      };
      this.updateStarFilter = this.updateStarFilter.bind(this);
      this.updateReviewScore = this.updateReviewScore.bind(this);
      this.updatePrice = this.updatePrice.bind(this);
      this.updateAnemities = this.updateAnemities.bind(this);
  }

    componentWillReceiveProps(newProps){
        if(newProps.timestamp !== this.props.timestamp){
            this.setState({
                rating:5,
                reviewScoreMin: 0,
                reviewScoreMax: 5,
                priceMin: 0,
                priceMax: 2000,
                amenities: []
            });
        }
    }

  updateReviewScore(value) {
    var min = value[0];
    var max = value[1];
    this.setState({
        reviewScoreMin : min,
        reviewScoreMax: max
    }, function(){
        this.props.applyFilters(this.state);
    });
  }

  updatePrice(value) {
    var min = value[0];
    var max = value[1];
    this.setState({
        priceMin: min,
        priceMax: max
    }, function(){
        this.props.applyFilters(this.state);
    });
  }

  updateStarFilter(starObject) {
    if(starObject.type === 'click') {
      this.setState({
          rating: starObject.rating
      }, function(){
        this.props.applyFilters(this.state);
      });
    }
  }

  updateAnemities(newFilter) {
    this.setState({
      amenities: newFilter
    }, function() {
      this.props.applyFilters(this.state);
    });
  }

  render() {
    return (
      <div className="groups-content">
          <div className="groups-section">
              <div className="groups-title">
                  Stars
              </div>
              <div className="groups-list">
                  <ul>
                      <li className="text-center">
                        <Rater total={5} interactive={true} rating={this.state.rating} onRate={this.updateStarFilter.bind(this)}/>
                      </li>
                  </ul>
              </div>
          </div>
          <div className="groups-section">
              <div className="groups-title">
                  Rating
              </div>
              <div className="groups-list">
                  <ul>
                      <li className="text-center">
                        <div className="move_bottom_20">
                          <div className="pull-left"> {this.state.reviewScoreMin}</div>
                          <div className="text-right"> {this.state.reviewScoreMax}</div>
                        </div>
                        <div>
                          <Range min={0} max={5} step={1} defaultValue={[0, 5]} onChange={this.updateReviewScore} />
                        </div>
                      </li>
                  </ul>
              </div>
          </div>
          <div className="groups-section">
              <div className="groups-title">
                  Amenities
              </div>
              <div className="groups-list">
                <CheckboxGroup
                    name="amenities"
                    value={this.state.amenities}
                    onChange={this.updateAnemities} className="CheckboxGroup">
                  <ul>
                      <li>
                        <label className="labelCheckBox"><Checkbox value="Pool"/> Pool </label>
                      </li>
                      <li>
                        <label className="labelCheckBox"><Checkbox value="Lunch"/> Lunch </label>
                      </li>
                      <li>
                        <label className="labelCheckBox"><Checkbox value="Parking"/> Parking </label>
                      </li>
                      <li>
                        <label className="labelCheckBox"><Checkbox value="Dinner"/> Dinner </label>
                      </li>
                      <li>
                        <label className="labelCheckBox"><Checkbox value="Wifi"/> Wifi </label>
                      </li>
                      <li>
                        <label className="labelCheckBox"><Checkbox value="Jacuzzi"/> Jacuzzi </label>
                      </li>
                      <li>
                        <label className="labelCheckBox"><Checkbox value="TV"/> TV </label>
                      </li>
                      <li>
                        <label className="labelCheckBox"><Checkbox value="AC"/> AC </label>
                      </li>
                  </ul>
                </CheckboxGroup>
              </div>
          </div>
          <div className="groups-section">
              <div className="groups-title">
                  Price
              </div>
              <div className="groups-list">
                  <ul>
                      <li className="text-center">
                        <div className="move_bottom_20">
                          <div className="pull-left"> ${this.state.priceMin}</div>
                          <div className="text-right"> ${this.state.priceMax}</div>
                        </div>
                        <div>
                          <Range min={0} max={2000} step={1} defaultValue={[0, 2000]} onChange={this.updatePrice} />
                        </div>
                      </li>
                  </ul>
              </div>
          </div>
        </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllHotels : (state) => dispatch(hotelActions.getAllHotels(state))
    }
}

function mapStateToProps(state) {
    return {

    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(props => <HotelFilters {...props}/>));
