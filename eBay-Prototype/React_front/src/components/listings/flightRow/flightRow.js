import React, { Component } from 'react';
import './flightRow.css';

class FlightRow extends Component {

    constructor(props){
        super(props) ;
        var prices = [this.props.data.firstClassPrice,this.props.data.businessClassPrice,this.props.data.economyClassPrice];
        this.minFare = Math.min.apply(null, prices);
        this.maxFare = Math.max.apply(null, prices);
        this.duration = this.timeDiff(this.props.data.arrival,this.props.data.departure);
    }

    timeDiff(first, second) {
        var f = first.split(':'), s = second.split(':');
        var fh = parseInt(f[0], 10);
        var fm = parseInt(f[1], 10);
        var sh = parseInt(s[0], 10);
        var sm = parseInt(s[1], 10);

        var minutes = 0;
        if(fh<sh) {
            minutes = ((fh*60)+fm) + ((24*60)-((sh*60)+sm));
        } else {
            minutes = ((fh*60)+fm) - ((sh*60)+sm);
        }
        return (minutes/60 < 1 ? '':(Math.floor(minutes/60))+'h ') + (minutes%60 < 1 ? '':(minutes%60+'m'));
    }

  	render() {
    	return (
      		<div className="flights-row">
                <div className="info-section">
                    <div className="first">
                        <div className="info-child carrier">
                            <p className="name">{this.props.data.flightNumber}</p>
                            <p className="name">{this.props.data.airline}</p>
                        </div>
                        <div className="info-child time">
                            <div className="dep">
                                <p>{this.props.data.departure}</p>
                                <span>{this.props.data.source}</span>
                            </div>
                            <div className="divider"></div>
                            <div className="arr">
                                <p>{this.props.data.arrival}</p>
                                <span>{this.props.data.destination}</span>
                            </div>
                        </div>
                        <div className="info-child duration">
                            <p className="duration">{this.duration}</p>
                        </div>
                    </div>
                    <div className="second">
                        <div className="seat-section">
                            <label>First Class</label>
                            <p>${this.props.data.firstClassPrice}</p>
                        </div>
                        <div className="seat-section">
                            <label>Business</label>
                            <p>${this.props.data.businessClassPrice}</p>
                        </div>
                        <div className="seat-section">
                            <label>Economy</label>
                            <p>${this.props.data.economyClassPrice}</p>
                        </div>
                    </div>
                </div>
                <div className="price-section">
                    {
                        this.minFare !== this.maxFare ? <p>${this.minFare} - ${this.maxFare}</p> :  <p>${this.minFare} </p>
                    }
					<button className="btn btn-primary btn-kayak" onClick={(id)=>this.props.onBookClick(this.props.data.id)}>Book</button>
				</div>
            </div>
    	);
  	}
}

export default FlightRow;
