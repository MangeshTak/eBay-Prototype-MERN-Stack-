import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import './paymentMethods.css';
import * as profileApis from '../../../api/profile';
import PaymentMethodComponents from './paymentMethodComponents/paymentMethodComponents'
import { Modal } from 'react-bootstrap';
import * as analytics from '../../../actions/analytics';



class PaymentMethods extends Component {

    constructor(props){
        super(props) ;

        this.state = {
            creditCards : [] ,
            showCardModal : false ,
            cardNumber : '',
            nameOnCard : '',
            expiryDate : '',
            cvv : ''

        }

        this.showCardModal = this.showCardModal.bind(this);
        this.hideCardModal = this.hideCardModal.bind(this);
        this.saveCard = this.saveCard.bind(this);
        this.getCreditCardsForUser = this.getCreditCardsForUser.bind(this);
    }

    getCardNumber(e){
        if(e.target.value.length === 4 || e.target.value.length === 11 || e.target.value.length === 18 ){
            e.target.value += " - "
        }



        if(e.target.value.length <= 25){
            this.setState({
                cardNumber : e.target.value
            })
        }

    }


    trackClick(click, page) {
        var payload = {'click' : click, 'page' : page};
        this.props.trackClick(payload);
    }

    getNameOnCard(e){
        this.setState({
            nameOnCard : e.target.value
        })
    }

    getExpiryDate(e){

        if(e.target.value.length === 2 && e.target.value.indexOf("/") === -1){
            e.target.value += "/"
        }

        var mm = ( e.target.value.substring(0 , e.target.value.indexOf("/")));
        var yy = ( e.target.value.substring(e.target.value.indexOf("/") +1, e.target.value.length));

        if(e.target.value.length < 6 && (!isNaN(mm) && !isNaN(yy)    )){
            this.setState({
                expiryDate : e.target.value
            })
        }
    }

    getCvv(e){
        if(!isNaN(e.target.value) && e.target.value.length < 4){
            this.setState({
                cvv : e.target.value
            })
        }


    }

    showCardModal(){
        this.trackClick('add-new-card', '/profile');
        this.setState({showCardModal : true  })
    }

    hideCardModal(){
        this.setState({showCardModal : false  })
    }

    saveCard(){
        var _this = this ;
        if(_this.state.cardNumber === "" || _this.state.cvv === "" || _this.state.nameOnCard === ""  || _this.state.expiryDate === ""){
            alert("Invalid Card Details");
            return ;
        }


        var _obj = {
            cardNumber : _this.state.cardNumber ,
            cvv : _this.state.cvv ,
            nameOnCard : _this.state.nameOnCard ,
            expiryDate : _this.state.expiryDate
        }

        profileApis.addCreditCard(_obj, function(err , response){
            if(!err){
                response.then(res => {
                    if(res.status === 200){

                        _this.setState({ cardNumber : '',
                            nameOnCard : '',
                            expiryDate : '',
                            cvv : '' ,
                            showCardModal : false
                        })

                        _this.getCreditCardsForUser() ;

                    }
                })
            }
        })

    }

    componentDidMount(){
        this.getCreditCardsForUser();
    }


    getCreditCardsForUser(){
        var _this = this ;
        profileApis.getCreditCards(function(error, response){
            if(error){

            } else {
                response.then((res) => {
                    if(res.status === 200){
                        _this.setState({
                            creditCards:res.data
                        })
                    }else{

                    }
                })
            }
        })
    }

    render() {

        var creditCardNo = 0 ;
        var creditCardsList = this.state.creditCards.map((card , key  ) => {
            creditCardNo += 1 ;
            return   <PaymentMethodComponents  getCreditCardsForUser={this.getCreditCardsForUser}  card={card} key={key} number={creditCardNo}/>
        })

        return (
            <div className="profile-panel payments-page-wrapper">
                <div className="profile-panel-body">
                    <div className="row">
                        <div className="col-xs-12 text-right">
                            <button onClick={this.showCardModal} className="btn btn-primary btn-kayak">
                                <i className="fa fa-plus add-card-button" aria-hidden="true"></i> New card
                            </button>
                        </div>


                        <div className="col-xs-12">
                            {creditCardsList}
                        </div>
                    </div>


                    <Modal show={this.state.showCardModal}  id="carModal" className="profileModal cardModal">
                        <Modal.Body>
                            <div className="form-group row">
                                <div className="col-xs-12">
                                    <input value={this.state.cardNumber} type="text" className="form-control" placeholder="Card number (XXXX XXXX XXXX XXXX)"
                                           onChange={this.getCardNumber.bind(this)}  />
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-xs-12">
                                    <input value={this.state.nameOnCard} onChange={this.getNameOnCard.bind(this)} type="text" className="form-control" placeholder="Name on card"
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-xs-6">
                                    <input value={this.state.expiryDate} onChange={this.getExpiryDate.bind(this)} type="text" className="form-control" placeholder="Expiry date (MM/YY)"
                                    />
                                </div>
                                <div className="col-xs-6">
                                    <input type="text" value={this.state.cvv} onChange={this.getCvv.bind(this)} className="form-control" placeholder="CVV"
                                    />
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="row">
                                <div className="col-xs-12">
                                    <button onClick={this.hideCardModal} className="btn btn-default btn-kayak btn-kayak-default">Cancel</button>
                                    <button onClick={this.saveCard} className="btn btn-primary btn-kayak">Add card</button>
                                </div>
                            </div>
                        </Modal.Footer>

                    </Modal>


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

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(props => <PaymentMethods {...props}/>));