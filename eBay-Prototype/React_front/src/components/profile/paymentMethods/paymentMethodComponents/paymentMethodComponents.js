import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import './paymentMethodComponents.css';
import { Modal } from 'react-bootstrap';
import * as profiles from '../../../../api/profile.js' ;
import * as analytics from '../../../../actions/analytics';


class PaymentMethodsComponents extends Component {

    constructor(props){
        super(props) ;

        this.state = {
           openCardDeleteModal : false
        }
    }


  trackClick(click, page) {
    var payload = {'click' : click, 'page' : page};
    this.props.trackClick(payload);
  }

   deleteCard(){
       var _this = this ;
       profiles.deleteCreditCard(this.props.card._id , function(err , response){
            if(!err){
                response.then(res => {
                    if(res.status === 200){
                        _this.props.getCreditCardsForUser();
                        _this.setState({ openCardDeleteModal : false})
                    }
                })
            }
        })
   }

   openDeleteCardModal(){
    this.setState({openCardDeleteModal : true  })
   }

    closeDeleteCardModal(){
        this.setState({openCardDeleteModal : false  })
    }

    render() {

        return (
            <div className="credit-card-div">
                <div className="col-xs-10">
                    <span>#{this.props.number}</span>
                    <label>{this.props.card.cardNumber}</label>
                </div>
                <div className="col-xs-2 text-right">
                    <a href="javascript:void(0)" onClick={this.openDeleteCardModal.bind(this)}><i className="fa fa-minus-circle fa-lg" aria-hidden="true"></i></a>
                </div>
                <div className="clearfix"></div>

                <Modal show={this.state.openCardDeleteModal}   id="carModal" className="profileModal cardModal">

                    <Modal.Body>
                        <b>Are you sure to delete the Card ? </b>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-primary btn-kayak" onClick={this.deleteCard.bind(this)}>YES</button>
                        <button className="btn btn-default btn-kayak btn-kayak-default" onClick={this.closeDeleteCardModal.bind(this)}>NO</button>
                    </Modal.Footer>
                </Modal>
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

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(props => <PaymentMethodsComponents {...props}/>));
