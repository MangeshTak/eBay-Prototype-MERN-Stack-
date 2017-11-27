import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import './listings.css';
import Search from './search/search';
import Filters from './filters/filters';
import Sorts from './sorts/sorts';
import FlightRow from './flightRow/flightRow';
import HotelRow from './hotelRow/hotelRow';
import CarRow from './carRow/carRow';
import * as carActions from '../../actions/car';
import * as flightActions from '../../actions/flight';
import * as hotelActions from '../../actions/hotel';
import * as utilActions from '../../actions/util';
import AuthModal from '../authModal/authModal';
import * as analytics from '../../actions/analytics';

class Listings extends Component {

    constructor(props){
        super(props) ;
        this.state = {
            category : this.props.match.params.category,
            queryParams : this.props.location.search,
            showAuthModal:false,
            filters:{},
            sorts:{},
            timestamp:new Date().getTime(),
            listings:[]
        }
        this.closeAuthModal = this.closeAuthModal.bind(this);
        this.loadPage = this.loadPage.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
        this.applySorts = this.applySorts.bind(this);
        this.onBookClick = this.onBookClick.bind(this);
    }

    trackClick(click, page) {
        var payload = {'click' : click, 'page' : page};
        this.props.trackClick(payload);
    }

    closeAuthModal(){
        this.setState({
            showAuthModal:false
        })
    }

    componentDidMount(){
        this.loadPage(this.state.queryParams);
    }

    componentWillReceiveProps(newProps){
        if(decodeURI(this.props.location.search) !== decodeURI(newProps.location.search)){
            this.setState({
                category : newProps.match.params.category,
                queryParams : newProps.location.search,
                showAuthModal:false,
                filters:{},
                sorts:{},
                timestamp:new Date().getTime(),
                listings:[]
            }, function(){
                this.loadPage(this.state.queryParams);
            });
        } else if(this.props.currentPage !== newProps.currentPage){
            this.setState({
                listings:this.state.listings.concat(newProps.listings)
            })
        }
    }

    componentWillUnmount(){
        this.props.clearListingsFromStore();
    }

    loadPage(queryParams,filters,sorts,pageNo){
        if(this.state.category === 'cars'){
            this.trackClick('cars-filters', '/cars/listings')
            this.props.getAllCars(queryParams,filters,sorts,pageNo) ;
        } else if(this.state.category === 'flights') {
            this.trackClick('flights-filters', '/flights/listings')
            this.props.getAllFlights(queryParams,filters,sorts,pageNo);
        } else {
            this.trackClick('hotels-filters', '/hotels/listings')
            this.props.getAllHotels(queryParams,filters,sorts,pageNo);
        }
    }

    applyFilters(filters){
        this.setState({
            filters:filters,
            listings:[]
        }, function(){
            this.loadPage(this.state.queryParams,this.state.filters,this.state.sorts);
        });
    }

    onBookClick(id){
        if(this.props.isLogged){
            this.trackClick('Book-'+this.state.category, '/'+this.state.category+'/listings');
            this.props.history.push('/'+this.state.category+'/'+id+'/checkout'+this.state.queryParams);
        } else {
            this.trackClick('Anonymous-Book-'+this.state.category, '/'+this.state.category+'/listings');
            this.setState({
                showAuthModal:true
            })
        }
    }

    applySorts(sorts){
        this.setState({
            sorts:sorts,
            listings:[]
        }, function(){
            this.loadPage(this.state.queryParams,this.state.filters,this.state.sorts);
        });
    }

    onLoadMoreClick(){
        this.loadPage(this.state.queryParams,this.state.filters,this.state.sorts,parseInt(this.props.currentPage)+1);
    }

    render() {
        return (
			<div className="listings-page-wrapper">
				<div className="inline-search-container">
					<Search/>
				</div>
				<div className="page-container">
					<div className="filters-container">
                        <Filters applyFilters={this.applyFilters} timestamp={this.state.timestamp}/>
					</div>
					<div className="center-container">
						<div className="sorting-container">
							<Sorts applySorts={this.applySorts} timestamp={this.state.timestamp}/>
						</div>
						<div className="row data-container">
                            {
                                this.props.totalListings > 0 ? (
                                    this.state.listings.map((listing , key) => {
                                        if(this.state.category === 'hotels') {
                                            return <HotelRow data={listing} key={key} onBookClick={this.onBookClick}/>
                                        } else if (this.state.category === 'flights') {
                                            return <FlightRow data={listing} key={key} onBookClick={this.onBookClick}/>
                                        } else {
                                            return <CarRow data={listing} key={key} onBookClick={this.onBookClick}/>
                                        }
                                    })
                                ) : (
                                    <h3 className="empty-message">No results to display</h3>
                                )
                            }
						</div>
                        {
                        	this.state.listings && this.props.totalListings > this.state.listings.length ? (
                                <div className="load-more-btn">
                                    <button className="btn btn-primary btn-kayak" onClick={this.onLoadMoreClick.bind(this)}>Load more</button>
                                </div>
                            ):(
                                <div></div>
                            )
                        }
					</div>
					<div className="clearfix"></div>
				</div>
                <AuthModal showAuthModal={this.state.showAuthModal} closeAuthModal={this.closeAuthModal}></AuthModal>
			</div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        getAllCars : (queryParams,filters,sorts,pageNo) => dispatch(carActions.getAllCars(queryParams,filters,sorts,pageNo)),
        getAllFlights : (queryParams,filters,sorts,pageNo) => dispatch(flightActions.getAllFlights(queryParams,filters,sorts,pageNo)),
        getAllHotels : (queryParams,filters,sorts,pageNo) => dispatch(hotelActions.getAllHotels(queryParams,filters,sorts,pageNo)),
        clearListingsFromStore : () => dispatch(utilActions.clearListingsFromStore()),
        trackClick : (payload) => dispatch(analytics.trackClick(payload))
    }
}

function mapStateToProps(state) {
    return {
        listings:state.listingsReducer.listings.docs,
        totalListings:state.listingsReducer.listings.total,
        currentPage:state.listingsReducer.listings.page,
        isLogged:state.authReducer.isLogged
    };
}

export default withRouter(connect(mapStateToProps , mapDispatchToProps )(props => <Listings {...props}/>));
