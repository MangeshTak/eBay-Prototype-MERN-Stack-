import React, { Component } from 'react';
import './roomType.css';

class RoomType extends Component {


  render() {
    return (
      <div className="col-xs-6 roomType-container text-center">
        <div className="roomType-label">
          {this.props.data.roomType} - ${this.props.data.priceTotal}
          </div>
      </div>
    );
  }
}

export default RoomType;
