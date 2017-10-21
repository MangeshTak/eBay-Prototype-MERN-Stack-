import React, { Component } from 'react';
import {Link} from 'react-router-dom'

const axios = require('axios');

class Signup extends Component {
     constructor(props) {
    super(props);
    this.state = {firstName: '',
				  lastName: '',
				  phoneNumber: '',
				  email: '',
				  passWord: '',
				  confirmPassword: ''};

    this.handlefirstNameChange = this.handlefirstNameChange.bind(this);
    this.handlelastNameChange = this.handlelastNameChange.bind(this);
    this.handlephoneNumberChange = this.handlephoneNumberChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlepassWordChange = this.handlepassWordChange.bind(this);
    this.handleconfirmPasswordChange = this.handleconfirmPasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlefirstNameChange(event) {
    this.setState({firstName: event.target.value});
  }

  handlelastNameChange(event) {
    this.setState({lastName: event.target.value});
  }

  handlephoneNumberChange(event) {
    this.setState({phoneNumber: event.target.value});
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }

  handlepassWordChange(event) {
    this.setState({passWord: event.target.value});
  }

  handleconfirmPasswordChange(event) {
    this.setState({confirmPassword: event.target.value});
  }

  handleSubmit(event) {
  	if(this.state.firstName==='')
  	{
  		alert("Please enter first name");
  	}
  	else if(this.state.lastName==='')
  	{
  		alert("Please enter last name");
  	}
  	else if(this.state.email==='')
  	{
  		alert("Please enter email");
  	}
  	else if(this.state.passWord==='')
  	{
  		alert("Please enter password");
  	}
  	else if(this.state.passWord!=this.state.confirmPassword)
  	{
  		alert("Passwords are not matching")
  	}
  	else
  	{
      axios.post('http://localhost:4000/signup', {
        firstname: this.state.firstName,
        lastname: this.state.lastName,
        email: this.state.email,
        password: this.state.passWord,
        phonenumber: this.state.phoneNumber
      }).then(function (response) {
        console.log(response);
        alert("Data saved");  
      }).catch(function (error) {
        console.log(error);
        alert("Unable to save data");  
      });

  		event.preventDefault();
      
      this.setState( {firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          passWord: '',
          confirmPassword: ''});
  	}    
    
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
      <ul>
        <li><label>First Name:<input type="text" placeholder="Enter first name" value={this.state.firstName} onChange={this.handlefirstNameChange}/></label></li>
        <li><label>Last Name:<input type="text" placeholder="Enter last name" value={this.state.lastName} onChange={this.handlelastNameChange}/></label></li>
        <li><label>Phone No:<input type="number" placeholder="Phone number" value={this.state.phoneNumber} onChange={this.handlephoneNumberChange}/></label></li>
        <li><label>Email:<input type="email" placeholder="Email" value={this.state.email} onChange={this.handleEmailChange}/></label></li>
        <li><label>Password:<input type="password" placeholder="Please choose password" value={this.state.passWord} onChange={this.handlepassWordChange}/></label></li>
        <li><label>Confirm Password:<input type="password" placeholder="Please enter again" value={this.state.confirmPassword} onChange={this.handleconfirmPasswordChange}/></label></li>
        <input type="submit" value="Submit" />
       </ul>
      </form>
    );
  }
}

export default Signup;
