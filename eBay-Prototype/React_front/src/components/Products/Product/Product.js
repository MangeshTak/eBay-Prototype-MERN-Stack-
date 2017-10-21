import React, { Component } from 'react';

import './Product.css'

class Product extends Component {
    render() {
        return (
            <div className="col-lg-4">
                <div className="Product1">

                    <div className="Product2">

                            {/*<div>*/}
                            {/*<p>Product-{this.props.productNo}</p>*/}
                            {/*</div>*/}
                            <a href="">
                                <div className="ItemName">
                                    <p>{this.props.itemName}</p>
                                </div>
                            </a>
                            <div>
                                <p>Description- {this.props.itemDescription}</p>
                            </div>
                            <div className="Seller">
                                <p>Sold By <span className="SellerInfo">{this.props.sellerInfo}</span></p>
                            </div>
                            <div className="Price">
                                <p>$ {this.props.itemPrice}</p>
                            </div>
                            <div className="Quantity">
                                <p>{this.props.quantity} items left</p>
                            </div>
                            <button className="btn btn-primary">Buy</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Product;
