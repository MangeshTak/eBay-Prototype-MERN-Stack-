import React, { Component } from 'react';
import Header from './components/Header/Header';
import Products from './components/Products/Products';
import Signup from './components/sign/signup';
import Login from './components/sign/login';
import { Router, IndexRoute, hashHistory} from "react-router";
import { Switch, Route } from 'react-router'
import './App.css';

class App extends Component {
    render() {
        return (
            <div>
                <Header/>
                         

				<Switch>
				  <Route exact path="/" component={Products}/>
				  <Route path="/signup" component={Signup}/>
				</Switch>

            </div>
        );
    }
}

export default App;
