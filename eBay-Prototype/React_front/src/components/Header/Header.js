import React, { Component } from 'react';
import './Header.css';
import {Link} from 'react-router-dom'
import Modal from 'react-modal';
import {withRouter} from 'react-router'

const axios = require('axios');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class Header extends Component {

constructor() {
    super();
 
    this.state = {
      modalIsOpen: false,
      email: '',
      password: '',
      login: false,
      islogin: false,
      token: 0,
      cartIsOpen: false
    };
 
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.UserLogin = this.UserLogin.bind(this);
    this.UserLogout = this.UserLogout.bind(this);
    this.handleemailChange = this.handleemailChange.bind(this);
    this.handlepasswordChange = this.handlepasswordChange.bind(this);
    this.openCartModal = this.openCartModal.bind(this);
    this.closeCartModal = this.closeCartModal.bind(this);
  }

 
  handleemailChange(event) {
    this.setState({email: event.target.value});
  }

  handlepasswordChange(event) {
    this.setState({password: event.target.value});
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }
  
  openCartModal() {
    this.setState({cartIsOpen: true});
  }

  UserLogin() {
    var _this=this;
    axios.post('http://localhost:4000/login', {
        email: this.state.email,
        password: this.state.password
      }).then(function (response) {
        
        console.log(response);
        if(response.data===''){
          alert("Not Found");
        }else{
          //alert("correct");
          console.log("login");
          _this.setState({email: '', password: '', modalIsOpen: false, islogin: true, token: response.data.tokens[0].token}, function(){
            console.log(_this.state);
          });
          console.log(_this.props.history);
          _this.props.history.push({pathname:'/'});
        }

      }).catch(function (error) {
        console.log(error);
        alert("oops... something went wrong..");  
      });

  }


UserLogout() {

  var _this=this;

  axios.post('http://localhost:4000/logout', {token: this.state.token}).then((response)=>{
    _this.setState({email: '', password: '', islogin: false, token:0});
  }).catch((error)=>{
    console.log(error);
  });
    
  }

  closeModal() {
    this.setState({email: '', password: '', modalIsOpen: false});
  }

  closeCartModal() {
    this.setState({cartIsOpen: false});
  }

    render() {
      console.log("login : ", this.state.islogin);
      if(!this.state.islogin){

        return (
            <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid Header">
                        <div className="navbar-header"> <a className="navbar-brand"><Link to="/">Home</Link></a></div>
                        <div className="List">
                            <ul className="nav navbar-nav navbar-right">
                                <li><Link to="/signup">Sign up</Link></li>
                                <li><a onClick={this.openModal}>Login</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>

          <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="User Login" >
          
          
            <h3>Please Login</h3>
            <ul>
                <li><label>Email:<input type="email" placeholder="Please enter your email" value={this.state.email} onChange={this.handleemailChange}/></label></li>
                <li><label>Password:<input type="password" placeholder="Please choose password" value={this.state.password} onChange={this.handlepasswordChange}/></label></li>
                <input type="button" value="Submit" onClick={this.UserLogin}/>
            </ul>
            
          
        </Modal>

          
            </div>

        );

      }else{

        return (
            <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid Header">
                        <div className="navbar-header"> <a className="navbar-brand"><Link to="/">Home</Link></a></div>
                        <div className="List">
                            <ul className="nav navbar-nav navbar-right">
                                <li><Link to="#">Post Ad</Link></li>
                                <li><a onClick={this.openCartModal}>Cart</a></li>
                                <li><a onClick={this.UserLogout}>Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
          
            <Modal

          isOpen={this.state.cartIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeCartModal}
          style={customStyles}
          contentLabel="Your Cart" >
          
          
            <h3>Your Shopping Cart</h3>
            <ul>
                <li><label>Email:<input type="email" placeholder="Please enter your email" value={this.state.email} onChange={this.handleemailChange}/></label></li>
                <li><label>Password:<input type="password" placeholder="Please choose password" value={this.state.password} onChange={this.handlepasswordChange}/></label></li>
                <input type="button" value="Submit" onClick={this.UserLogin}/>
            </ul>
                      
        </Modal>      

            </div>

        );

      }
    } 
  }

export default withRouter(Header);
