import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Products from './components/Products/Products';
import registerServiceWorker from './registerServiceWorker';
import Signup from './components/sign/signup';
import {Router, Route, IndexRoute, hashHistory} from "react-router";
import {BrowserRouter} from "react-router-dom";	



// const app = document.getElementById('root');

// ReactDOM.render(
//   <BrowserRouter>
//   	<div>
//     <Route path="/" component={App} ></Route>    	
//     <Route path="/signup" component={Signup} />
//     </div>	
//   </BrowserRouter>,
//app);


ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));
registerServiceWorker();