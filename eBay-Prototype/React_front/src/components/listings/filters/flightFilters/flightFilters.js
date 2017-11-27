import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './flightFilters.css';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';
import {connect} from 'react-redux';
import * as carActions from '../../../../actions/car';
import { Range } from 'rc-slider';

class FlightFilters extends Component {

    constructor(props) {
        super(props);
        this.state = {
            meals : [] ,
            luggage : [] ,

            minPrice : 0  ,
            maxPrice : 5000
        };

        this.updatePrice = this.updatePrice.bind(this);
        this.mealsChanged = this.mealsChanged.bind(this);

    }

    componentWillReceiveProps(newProps){
        if(newProps.timestamp !== this.props.timestamp){
            this.setState({
                meals : [] ,
                luggage : [] ,

                minPrice : 0  ,
                maxPrice : 5000
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


     mealsChanged = (newMeals) => {
        this.setState({
            meals: newMeals
        }, function(){
           this.props.applyFilters(this.state);

        });
    }


    luggageChanged = (newluggage) => {
        this.setState({
            luggage: newluggage
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
                                    <Range min={0} max={5000} step={1} defaultValue={[0, 5000]} onChange={this.updatePrice} />
                                </div>

                            </li>
                        </ul>
                    </div>
                </div>


                 <div className="groups-section">
                    <div className="groups-title">
                        Meals
                    </div>
                    <div className="groups-list">
                        <ul>
                            <li>

                               <CheckboxGroup
                                    name="meals"
                                    value={this.state.meals}
                                    onChange={this.mealsChanged} className="CheckboxGroup">

                                    <label className="labelCheckBox"><Checkbox value="true"/> YES </label>
                                    <label className="labelCheckBox"><Checkbox value="false"/> NO </label>
                                </CheckboxGroup>

                            </li>
                        </ul>
                    </div>
                </div>


                <div className="groups-section">
                    <div className="groups-title">
                        Luggage Bag
                    </div>
                    <div className="groups-list">
                        <ul>
                            <li>

                               <CheckboxGroup
                                    name="luggage"
                                    value={this.state.luggage}
                                    onChange={this.luggageChanged} className="CheckboxGroup">

                                    <label className="labelCheckBox"><Checkbox value="0"/> 0</label>
                                    <label className="labelCheckBox"><Checkbox value="1"/> 1</label>
                                    <label className="labelCheckBox"><Checkbox value="2"/> 2</label>
                                    <label className="labelCheckBox"><Checkbox value="3"/> 3</label>

                                </CheckboxGroup>

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
        getAllCars : () => dispatch(carActions.getAllCars())
    }
}

function mapStateToProps(state) {
    return {

    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(props => <FlightFilters {...props}/>));
