import React, { Component } from 'react';
import './landing.css';
import Banner from './banner/banner';

class Landing extends Component {

  	render() {
  		return (
	      	<div className="landing-page-wrapper">
	        	<Banner/>
	      	</div>
	    );
  	}
}

export default Landing;
