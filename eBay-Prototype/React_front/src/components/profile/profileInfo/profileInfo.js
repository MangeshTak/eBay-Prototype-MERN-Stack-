import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { updateUserProfile } from '../../../actions/profile';
import * as api from '../../../api/profile';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import * as analytics from '../../../actions/analytics';
import './profileInfo.css';

class ProfileInfo extends Component {

    constructor(props){
        super(props);
        this.state = {
            filename : '' ,
            profileFile : '',
            showProfileEditModal : false ,
            profile:{}
        }
        this.updateProfile = this.updateProfile.bind(this)
        this.openEditProfile = this.openEditProfile.bind(this);
        this.closeEditProfile = this.closeEditProfile.bind(this);
    }

    componentDidMount(){

        this.loadUserProfile();

    }

    loadUserProfile(){
        var _this = this;
        api.getUserDetails(function(error, response){
            if(error){

            } else {
                response.then((res) => {
                    if(res.status === 200){
                        _this.setState({
                            profile:res.data[0]
                        })
                    }else{

                    }
                })
            }
        })
    }


    componentWillReceiveProps(newProps) {
        if( (newProps.userUpdateSuccess) ) {
            this.setState({
                showProfileEditModal : false
            })
            this.loadUserProfile();
        } else {

        }
    }

    openEditProfile(){
        this.trackClick('edit-profile', '/profile');
        this.setState({
            showProfileEditModal : true
        })
    }

    closeEditProfile(){
        this.trackClick('close-edit-profile', '/profile');
        this.setState({
            showProfileEditModal : false
        })
    }

    trackClick(click, page) {
        var payload = {'click' : click, 'page' : page};
        this.props.trackClick(payload);
    }

    updateProfile() {
        //var _id= this.props.profile[0]._id;
        this.trackClick('update-profile', '/profile');
        var obj = {
            firstName : document.getElementById('firstName').value,
            lastName : document.getElementById('lastName').value,
            address : document.getElementById('address').value,
            city : document.getElementById('city').value,
            state : document.getElementById('state').value,
            zip_code : document.getElementById('zip_code').value,
            phone_number : document.getElementById('phone_number').value
        }
        this.props.updateUserProfile(obj, this.state.profileFile);
    }

    render() {
        return (
            <div className="profile-panel personal-details">
                <div className="profile-panel-body">
                    <div className="row">
                        <div className="col-xs-3">
                            <div className="profile-img">
                                <img className="img-circle img-responsive" src={this.state.profile.profile_image ? this.state.profile.profile_image:'/assets/images/user.png'}
                                     alt="profile"/>
                            </div>
                            <div className="btn-container">
                                <button type="button" className="btn btn-primary btn-kayak"
                                        onClick={this.openEditProfile}>Edit profile
                                </button>
                            </div>
                        </div>
                        <div className="col-xs-9">
                            <div className="row">
                                <div className="col-xs-6">
                                    <label className="label-text">First name</label>
                                    <p className="value">{this.state.profile.firstName}</p>
                                </div>
                                <div className="col-xs-6">
                                    <label className="label-text">Last name</label>
                                    <p className="value">{this.state.profile.lastName}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-6">
                                    <label className="label-text">Email</label>
                                    <p className="value">{this.state.profile.email}</p>
                                </div>
                                <div className="col-xs-6">
                                    <label className="label-text">Phone number</label>
                                    <p className="value">{this.state.profile.phone_number}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-6">
                                    <label className="label-text">Street address</label>
                                    <p className="value">{this.state.profile.address}</p>
                                </div>
                                <div className="col-xs-6">
                                    <label className="label-text">City</label>
                                    <p className="value">{this.state.profile.city}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-6">
                                    <label className="label-text">State</label>
                                    <p className="value">{this.state.profile.state}</p>
                                </div>
                                <div className="col-xs-6">
                                    <label className="label-text">Zip code</label>
                                    <p className="value">{this.state.profile.zip_code}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={this.state.showProfileEditModal} className="profileModal" id="editProfile">
                    <Modal.Body>
                        <div className="row form-group">
                            <label className="col-sm-3 ">First Name</label>
                            <div className="col-sm-8 ">
                                <input type="text" className="form-control" name="firstName" id="firstName"
                                       defaultValue={this.state.profile.firstName}></input>
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-sm-3 ">Last Name</label>
                            <div className="col-sm-8 ">
                                <input type="text" className="form-control" name="lastName" id="lastName"
                                       defaultValue={this.state.profile.lastName}></input>
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-sm-3 ">Email</label>
                            <div className="col-sm-8 ">
                                <input type="email" className="form-control" name="email" id="email"
                                       defaultValue={this.state.profile.email} disabled></input>
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-sm-3 ">Address</label>
                            <div className="col-sm-8 ">
                                <input type="email" className="form-control" name="address" id="address"
                                       defaultValue={this.state.profile.address}></input>
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-sm-3 ">City</label>
                            <div className="col-sm-8 ">
                                <input type="text" className="form-control" name="city" id="city"
                                       defaultValue={this.state.profile.city}></input>
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-sm-3 ">State</label>
                            <div className="col-sm-8 ">
                                <input type="text" className="form-control" name="state" id="state"
                                       defaultValue={this.state.profile.state}></input>
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-sm-3 ">Zip Code</label>
                            <div className="col-sm-8 ">
                                <input type="text" className="form-control" name="zip_code" id="zip_code"
                                       defaultValue={this.state.profile.zip_code}></input>
                            </div>
                        </div>
                        <div className="row form-group ">
                            <label className="col-sm-3 ">Phone Number</label>
                            <div className="col-sm-8 ">
                                <input type="text" className="form-control" name="phone_number"
                                       id="phone_number"
                                       defaultValue={this.state.profile.phone_number}></input>
                            </div>
                        </div>

                        <div className="row form-group">
                            <label htmlFor="profile" className="col-sm-3 ">Profile Image</label>

                            <div className="input-group image-preview col-sm-8">
                                <input type="text" value={this.state.filename}
                                       className="form-control image-preview-filename" disabled="disabled"/>
                                <span className="input-group-btn">

                                                    {
                                                        this.state.profileFile === '' ?
                                                            <span></span>
                                                            :
                                                            <button type="button" onClick={() => {
                                                                this.setState({profileFile: '', filename: ''})
                                                            }} className="btn btn-default image-preview-clear">
                                                                <span className="glyphicon glyphicon-remove"></span> Clear
                                                            </button>
                                                    }


                                    <div className="btn btn-default image-preview-input">
                                                                 <span className="glyphicon glyphicon-folder-open"></span>
                                                                 <span className="image-preview-input-title"></span> Browse
                                                                 <input type="file" onChange={(e) => {
                                                                     var file = e.target.files[0];


                                                                     if (file === undefined) {
                                                                         return;
                                                                     }

                                                                     this.setState({profileFile: file, filename: file.name})

                                                                 }} accept="image/png, image/jpeg, image/gif"
                                                                        name="input-file-preview"/>
                                                             </div>

                                                         </span>

                            </div>


                        </div>


                    </Modal.Body>

                    <Modal.Footer>
                        <button type="button" className="btn btn-default btn-kayak btn-kayak-default" onClick={this.closeEditProfile}>Close</button>
                        <button type="button" className="btn btn-primary btn-kayak" onClick={this.updateProfile} >Update</button>
                    </Modal.Footer>
                </Modal>




            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        updateUserProfile : (obj, file) => dispatch(updateUserProfile(obj, file)),
        trackClick : (payload) => dispatch(analytics.trackClick(payload))
    };
}

function mapStateToProps(state) {
    return {
        userUpdateSuccess : state.profileReducer.userUpdateSuccess
    };
}


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(props => <ProfileInfo {...props}/>));
