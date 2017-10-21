import React, { Component } from 'react';
import Product from './Product/Product';
import './Products.css';

class Products extends Component {
    state = [
        {itemName:'Lenovo K5', itemDescription:'good laptop..reliable', sellerInfo:'Mangesh Tak', itemPrice:500, quantity:10},
        {itemName:'Moto G', itemDescription:'good laptop..reliable', sellerInfo:'Kalikalyan Dash', itemPrice:400, quantity:10},
        {itemName:'Apple', itemDescription:'good laptop..reliable', sellerInfo:'Mangesh Dash', itemPrice:300, quantity:10},
        {itemName:'Nokia', itemDescription:'good laptop..reliable', sellerInfo:'Kalikalyan Tak', itemPrice:200, quantity:10},
        {itemName:'Samsung', itemDescription:'good laptop..reliable', sellerInfo:'Anna Tak', itemPrice:400, quantity:10}
    ];

    purchaseHandler=(id)=>{
        
    };

    items = this.state.map((item) => {
        return (<Product
                    purchaseHandler={this.purchaseHandler.bind(this,item._id)}
                    itemName={item.itemName}
                    itemDescription={item.itemDescription}
                    sellerInfo={item.sellerInfo}
                    itemPrice={item.itemPrice}
                    quantity={item.quantity}
                    productNo={item._id}/>);
    });

    render() {
        return (
            <div>
                <div className="col-lg-2">
                    Hi
                </div>
                <div className="col-lg-10">
                    <div className="row">
                        {this.items}
                    </div>
                </div>
            </div>
        );
    }
}

export default Products;
