import React, { Component } from 'react';
import {connect} from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import './sidebar.css';
import * as analytics from '../../actions/analytics';


class Sidebar extends Component {


    trackClick(click, page) {
      var payload = {'click' : click, 'page' : page};
      this.props.trackClick(payload);
    }
    render() {
        return (
			<div className="sidebar-panel">
				<div className="nav-container">
					<ul>
						<li onClick={()=> {this.trackClick('profile', '/profile')}}>
							<NavLink to="/user/profile">
								Profile
							</NavLink>
						</li>
						<li onClick={()=> {this.trackClick('payment-methods', '/profile')}}>
							<NavLink to="/user/paymentMethods">
								Payment methods
							</NavLink>
						</li>
						<li onClick={()=> {this.trackClick('past-bookings', '/profile')}}>
							<NavLink to="/user/bookings">
								Past bookings
							</NavLink>
						</li>
					</ul>
				</div>
			</div>
        );
    }

}


function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        trackClick : (payload) => dispatch(analytics.trackClick(payload))
    };
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(props => <Sidebar {...props}/>));
