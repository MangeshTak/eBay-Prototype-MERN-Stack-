import React, { Component } from 'react';
import './hotelRow.css';
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'
import RoomType from './roomType';

class HotelRow extends Component {

  constructor(props){
    super(props) ;

    this.state = {
       prices : [] ,
       minFare : 0 ,
       maxFare : 0
    }
   
  }

  componentWillMount(){
     var prices = [];
    this.props.data.hotelRooms.forEach(room => {
      prices.push(room.priceTotal);
    })
    this.setState({ prices : prices , minFare :  Math.min.apply(null, prices) , maxFare : Math.max.apply(null, prices)})
  }


  componentWillReceiveProps(newProps){
     var prices = [];
    newProps.data.hotelRooms.forEach(room => {
      prices.push(room.priceTotal);
    })
    this.setState({ prices : prices , minFare :  Math.min.apply(null, prices) , maxFare : Math.max.apply(null, prices)})
  }

  render() {
    return (
      <div className="hotels-row col-xs-12 no-padding">
        <div className="hotel-image col-xs-3">
          {this.props.data.images[0]?
            <img className="img-responsive" src={this.props.data.images[0]} alt="hotel-thumb"></img>
          : <img className="img-responsive" src="/assets/images/hotel_placeholder.png" alt="hotel-thumb"></img>
          }
        </div>
        <div className="title-section col-xs-7">
          <div className="hotel-title col-xs-9  no-padding">
            <div className="hotel-name">
              { this.props.data.hotelName }
            </div>
            <div className="hotel-address">
              { this.props.data.hotelCity }
            </div>
          </div>
          <div className="number-rating-container col-xs-3 text-right">
            <span className="number-rating"> {(this.props.data.hotelRating).toFixed(1)} </span>
            <span className="rating-type">
              {this.props.data.hotelRating === 5 ? "Excellent" : ""}
              {this.props.data.hotelRating === 4 ? "Good" : ""}
              {this.props.data.hotelRating === 3 ? "Average" : ""}
              {this.props.data.hotelRating === 2 ? "Below Average" : ""}
              {this.props.data.hotelRating === 1 ? "Poor" : ""}
            </span>
          </div>
          <div className="star-rating col-xs-12 no-padding">
            <Rater total={5} rating={this.props.data.hotelStar} interactive={false}/>
          </div>
          <div className="col-xs-12 amenities-container">
            {this.props.data.hotelAmenities.map((room, key) => {
              return <div key={key} className="amenities col-xs-3"><i className="fa fa-check-circle"></i> {room}</div>
            })}
          </div>
          <div className="col-xs-12">
            {this.props.data.hotelRooms.map((room, key) => {
              return <RoomType data={room} key={key}></RoomType>
            })}
          </div>
        </div>
        <div className="price-section col-xs-2 no-padding">
          {
            this.state.minFare !== this.state.maxFare ? <p>${this.state.minFare} - ${this.state.maxFare}</p> :  <p>${this.state.minFare} </p>
        }

        <button className="btn btn-primary btn-kayak" onClick={(id)=>this.props.onBookClick(this.props.data.id)}>Book</button>
      </div>
    </div>
  );
  }
}

export default HotelRow;
