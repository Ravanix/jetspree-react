import React from "react";
import {getAuthUser} from "../../data/account";
//import {Products} from "../../routes/products/List";
//import {Route, Link} from "react-router-dom";
import "./Profile.css"


class UserAbout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token:this.props.token,
            userName: '',
            userEmail: '',
            userId: '',
        };
        this.getUserInfo = this.getUserInfo.bind(this);
    }

    getUserInfo() {
        if (this.state.token)
            getAuthUser(this.state.token).then((data) => {
                this.setState({userEmail: data.result.email, userName: data.result.email, userId: data.result.id});
            })
    }

    componentDidMount() {
        this.getUserInfo()
    }

    render() {
        return (
           <h1>{this.state.userName}</h1>
        )
    }
}


export default UserAbout;