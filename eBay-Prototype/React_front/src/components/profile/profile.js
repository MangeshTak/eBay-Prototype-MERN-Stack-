import React, { Component } from 'react';
import './profile.css';
import Sidebar from "../sidebar/sidebar";

class Profile extends Component {

    render() {
        return (
            <div className="profile-page-wrapper">
                <div className="page-container">
                    <Sidebar></Sidebar>
                    <div className="tab-section">
                        {this.props.children}
                    </div>
                    <div className="clearfix"></div>
                </div>
            </div>
        );
    }
}

export default Profile;
