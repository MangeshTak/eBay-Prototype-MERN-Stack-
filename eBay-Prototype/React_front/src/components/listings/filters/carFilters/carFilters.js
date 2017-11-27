import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './carFilters.css';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';
import {connect} from 'react-redux';
import * as carActions from '../../../../actions/car';
import { Range } from 'rc-slider';

class CarFilters extends Component {

    constructor(props) {
        super(props);
        this.state = {
            occupants: [] ,
            luggage : [] ,
            category : [] ,

            minPrice : 0  ,
            maxPrice : 500
        };
        this.occupantsChanged = this.occupantsChanged.bind(this);
        this.luggageChanged = this.luggageChanged.bind(this);
        this.categoryChanged = this.categoryChanged.bind(this);
        this.updatePrice = this.updatePrice.bind(this);
    }

    componentWillReceiveProps(newProps){
        if(newProps.timestamp !== this.props.timestamp){
            this.setState({
                occupants: [] ,
                luggage : [] ,
                category : [] ,

                minPrice : 0  ,
                maxPrice : 500
            });
        }
    }

    updatePrice(value) {
        var min = value[0];
        var max = value[1];
        this.setState({
            minPrice : min ,
            maxPrice : max
        }, function(){
            this.props.applyFilters(this.state);
        });
    }

    occupantsChanged = (newoccupants) => {
        this.setState({
            occupants: newoccupants
        }, function(){
            this.props.applyFilters(this.state);
        });
    }

    luggageChanged = (newLuggage) => {
        this.setState({
            luggage: newLuggage
        }, function () {
            this.props.applyFilters(this.state);
        });
    }

    categoryChanged = (newCategory) => {
        this.setState({
            category: newCategory
        }, function(){
            this.props.applyFilters(this.state);
        });
    }

    render() {
        return (
            <div className="groups-content">
                <div className="groups-section">
                    <div className="groups-title">
                        Price Range
                    </div>
                    <div className="groups-list">
                        <ul>
                            <li>
                                 <div className="move_bottom_20">
                                      <div className="pull-left"> ${this.state.minPrice}</div>
                                      <div className="text-right"> ${this.state.maxPrice}</div>
                                 </div>
                                <div>
                                    <Range min={0} max={500} step={1} defaultValue={[0, 500]} onChange={this.updatePrice} />
                                </div>

                            </li>
                        </ul>
                    </div>
                </div>

                <div className="groups-section">
                    <div className="groups-title">
                        Luggage
                    </div>
                    <div className="groups-list">
                        <ul>
                            <li>
                                <CheckboxGroup
                                    name="luggage"
                                    value={this.state.luggage}
                                    onChange={this.luggageChanged} className="CheckboxGroup">

                                    <label className="labelCheckBox"><Checkbox value="YES"/> YES </label>
                                    <label className="labelCheckBox"><Checkbox value="NO"/> NO </label>
                                </CheckboxGroup>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="groups-section">
                    <div className="groups-title">
                        Capacity
                    </div>
                    <div className="groups-list">
                        <ul>
                            <li>
                                <CheckboxGroup
                                    name="occupants"
                                    value={this.state.occupants}
                                    onChange={this.occupantsChanged} className="CheckboxGroup">

                                    <label className="labelCheckBox"><Checkbox value="2"/> 2</label>
                                    <label className="labelCheckBox"><Checkbox value="4"/> 4</label>
                                    <label className="labelCheckBox"><Checkbox value="5"/> 5</label>
                                    <label className="labelCheckBox"><Checkbox value="7"/> 7</label>
                                    <label className="labelCheckBox"><Checkbox value="8"/> 8</label>
                                </CheckboxGroup>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="groups-section">
                    <div className="groups-title">
                        Category
                    </div>
                    <div className="groups-list">
                        <CheckboxGroup
                            name="category"
                            value={this.state.category}
                            onChange={this.categoryChanged} className="CheckboxGroup">

                            <ul>
                                <li>
                                    <label className="labelCheckBox"><Checkbox value="Standard"/> Standard</label>
                                </li>
                                <li>
                                    <label className="labelCheckBox"><Checkbox value="Premium"/> Premium</label>
                                </li>
                                <li>
                                    <label className="labelCheckBox"><Checkbox value="Full Size"/> Full Size</label>
                                </li>
                                <li>
                                    <label className="labelCheckBox"><Checkbox value="Luxury"/> Luxury</label>
                                </li>
                                <li>
                                    <label className="labelCheckBox"><Checkbox value="Compact SUV"/> Compact SUV</label>
                                </li>
                                <li>
                                    <label className="labelCheckBox"><Checkbox value="Standard SUV"/> Standard SUV</label>
                                </li>
                                <li>
                                    <label className="labelCheckBox"><Checkbox value="Intermediate SUV"/> Intermediate SUC</label>
                                </li>
                                <li>
                                    <label className="labelCheckBox"><Checkbox value="Full Size SUV"/> Full Size SUV</label>
                                </li>
                            </ul>
                        </CheckboxGroup>
                    </div>
                </div>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        getAllCars : () => dispatch(carActions.getAllCars())
    }
}

function mapStateToProps(state) {
    return {

    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(props => <CarFilters {...props}/>));
