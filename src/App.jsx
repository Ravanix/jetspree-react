import React, {Component} from "react";
import injectTapEventPlugin from "../node_modules/react-tap-event-plugin";
//import getMuiTheme from '../node_modules/material-ui/styles/getMuiTheme';
import MuiThemeProvider from "../node_modules/material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import FlatButton from "material-ui/FlatButton";

import logo from "./logo.svg";
import "../public/fonts/iconfont.css";
import "./App.css";
import "../node_modules/react-select/dist/react-select.min.css";
import {BrowserRouter as Router, Link, Route} from "react-router-dom";
import Landing from "./routes/Landing";
import BrowseCountries from "./routes/requests/Countries";
import ItemsList from "./routes/requests/List";
import RequestView from "./routes/requests/View";

import ProductsList from "./routes/products/Products";
import ProductView from "./routes/products/View";
import SignUp from "./routes/SignUp.jsx";
import Login, {GetUserInfo, LoginNavbar} from "./routes/Login";
import PostRequest from "./routes/PostRequest";
import PostTrip from "./routes/PostTrip";
import history from "./helper/History";
import SnackBar from "./components/SnackBar";
import Utils from "./helper/Utils";

injectTapEventPlugin();

const yuTheme = getMuiTheme({
    fontFamily: 'inherit',
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            snackBar: {open: false, message: ''}
        };
        // get token from cookie and set into state
        this.updateToken = this.updateToken.bind(this);
        this.showSnackBar = this.showSnackBar.bind(this);
        this.closeSnackBar = this.closeSnackBar.bind(this);
    }

    componentWillMount() {
        var token = Utils.getCookie("token");
        if (token !== "") {
            this.setState({token: token});
        }
    }

    updateToken(token) {
        this.setState({token: token});
        Utils.setCookie("token", token, 30);
    }

    showSnackBar(message) {
        this.setState({snackBar: {open: true, message: message}});
    }

    closeSnackBar() {
        this.setState({snackBar: {open: false, message: ''}});
    }

    render() {
        return (
            <Router history={history}>
                <MuiThemeProvider muiTheme={yuTheme}>
                    <div className="App">

                        <div className="header">
                            <div className="overflowFixBeta">
                                <div className="container">
                                    <img src={logo} className="App-logo" alt="logo"/>
                                    <FlatButton label="Home" containerElement={<Link to="/"/>}/>
                                    <FlatButton label="Countries" containerElement={<Link to="/countries"/>}/>
                                    <FlatButton label="Requests" containerElement={<Link to="/request"/>}/>
                                    <FlatButton label="Products" containerElement={<Link to="/products"/>}/>
                                    <LoginNavbar token={this.state.token}/>
                                    <GetUserInfo token={this.state.token} updateToken={this.updateToken}
                                                 showSnackBar={this.showSnackBar}/>
                                </div>
                            </div>
                        </div>
                        <Route exact path="/" component={Landing}/>
                        <Route path="/signup" component={SignUp}/>
                        <Route path="/login" component={() => (
                            <Login updateToken={this.updateToken} showSnackBar={this.showSnackBar}/>)}/>
                        <Route path="/countries" component={BrowseCountries}/>
                        <Route path="/items" component={ItemsList}/>
                        <Route exact path='/items/:Id' component={RequestView}/>

                        <Route path="/products" component={ProductsList}/>
                        <Route exact path='/products/:id' component={ProductView}/>
                        <Route path="/request" component={PostRequest}/>
                        <Route path="/trip" component={PostTrip}/>
                        <SnackBar open={this.state.snackBar.open} message={this.state.snackBar.message}
                                  close={this.closeSnackBar}/>
                    </div>
                </MuiThemeProvider>
            </Router>
        );
    }
}

export default App;
