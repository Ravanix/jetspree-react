import React from "react";
import {getAuthUser} from "../../data/account";
import Token from "../../helper/Token";
import {Products} from "../../routes/products/List";
import {Link} from "react-router-dom";
import {getRequests} from "../../data/requests";
import {getTrips} from "../../data/traveller"
import RaisedButton from "material-ui/RaisedButton";
import "./Profile.css"
import moment from 'moment'

class UserTrips extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trips: {},
        };
    }

    componentDidMount() {
        getTrips().then((data) => {
            this.setState({trips: data.result});
        })
    }

    render() {
        let current = moment();
        let currentDate = moment().format("DD MMM YYYY")
        if (this.state.trips.length > 0) {

            let passTripData = this.state.trips.filter((obj) => {
                return moment(obj.travel_date).isBefore(current) && moment(obj.return_date).isBefore(current)
            });
            let onTripData = this.state.trips.filter((obj) => {
                return moment(obj.travel_date).isBefore(current) && moment(obj.return_date).isAfter(current)
            });
            let activeTripData = this.state.trips.filter((obj) => {
                return moment(obj.travel_date).isAfter(current)
            });

            let passTrip = passTripData.map((obj, i) => {
                let passDate = moment(obj.return_date).format("DD MMM YYYY");
                const travelDate = moment(obj.travel_date).format("DD MMM YYYY");
                const returnDate = moment(obj.return_date).format("DD MMM YYYY");
                return (
                    <div className="colMd6 col" key={obj.id}>
                        <Link to={{pathname: `/trips/${obj.id}`, state: {modal: true}}}>
                            <div className="bgWhite relative">
                                <div className="imgWrap">
                                    <img src={"https://www.jetspree.com/images/country/pic-" + obj.travel_country_code + ".jpg"}
                                         alt={obj.travel_country_code}/>
                                </div>
                                <div className="productInfo">
                                    <span className="itemPrice">{obj.id} {obj.travel_country_code}</span>

                                    <p>Travel: {travelDate}</p>
                                    <p>Return: {returnDate}</p>
                                    <h4 className="itemName">Return at {passDate}</h4>
                                </div>
                            </div>
                        </Link>
                    </div>
                )
            });

            let onTrip = onTripData.map((obj, i) => {
                let passDate;
                const travelDate = moment(obj.travel_date).format("DD MMM YYYY");
                const returnDate = moment(obj.return_date).format("DD MMM YYYY");
                //console.log(moment().diff(moment(obj.return_date), 'days'));
                if ((moment().diff(moment(obj.return_date), 'days'))) {
                    passDate = moment(obj.return_date).fromNow()
                } else {
                    passDate = moment(obj.return_date).calendar()
                }

                return (
                    <div className="colMd6 col" key={obj.id}>
                        <Link to={{pathname: `/trips/${obj.id}`, state: {modal: true}}}>
                            <div className="bgWhite relative">
                                <div className="imgWrap">
                                    <img src={"https://www.jetspree.com/images/country/pic-" + obj.travel_country_code + ".jpg"}
                                         alt={obj.travel_country_code}/>
                                </div>
                                <div className="productInfo">
                                    <span className="itemPrice">{obj.id} {obj.travel_country_code}</span>
                                    <p>Travel: {travelDate}</p>
                                    <p>Return: {returnDate}</p>
                                    <h4 className="itemName">Return {passDate}</h4>
                                </div>
                            </div>
                        </Link>
                    </div>
                )
            });

            let activeTrip = activeTripData.map((obj, i) => {
                let goDate;
                const travelDate = moment(obj.travel_date).format("DD MMM YYYY");
                const returnDate = moment(obj.return_date).format("DD MMM YYYY");

                if ((moment().diff(moment(obj.return_date), 'days'))) {
                    goDate = "Travel Soon " + moment(obj.travel_date).fromNow()
                } else {
                    goDate = "Travel at " + moment(obj.travel_date).calendar()
                }

                return (
                    <div className="colMd6 col" key={obj.id}>
                        <Link to={{pathname: `/trips/${obj.id}`, state: {modal: true}}}>
                            <div className="bgWhite relative">
                                <div className="imgWrap">
                                    <img src={"https://www.jetspree.com/images/country/pic-" + obj.travel_country_code + ".jpg"}
                                         alt={obj.travel_country_code}/>
                                </div>
                                <div className="productInfo">
                                    <span className="itemPrice">{obj.id} {obj.travel_country_code}</span>

                                    <p>Travel: {travelDate}</p>
                                    <p>Return: {returnDate}</p>
                                    <h4 className="itemName">{goDate}</h4>
                                </div>
                            </div>
                        </Link>
                    </div>
                )
            });


            return (
                <div>
                    <div>
                        {onTrip}
                    </div>
                    {activeTrip}
                    <h3>Past Trips</h3>
                    {passTrip}
                </div>
            )
        }

        return null;
    }


}


class UserRequests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {},
        };
    }

    componentDidMount() {
        this.initData();
    }

    initData() {
        let paramItems = {
            pagesize: 4
        };
        getRequests(paramItems).then((data) => {
            this.setState({items: data.result, imageHost: data.image_host});
        });
    }

    render() {
        if (this.state.items.length > 0) {
            let itemsNodes = this.state.items.map((obj, i) => {
                return (
                    <div className="colMd6 col" key={obj.id}>
                        <Link to={{pathname: `/products/${obj.id}`, state: {modal: true}}}>
                            <div className="bgWhite relative">
                                <div className="imgWrap">
                                    <img src={this.state.imageHost + obj.image_path} alt="should be here"/>
                                </div>
                                <div className="productInfo"><span className="itemPrice">{obj.price}</span><h4 className="itemName">{obj.name}</h4>
                                </div>
                            </div>
                        </Link>
                    </div>
                )
            });

            return (
                <div>
                    {itemsNodes}
                </div>
            )
        }
        return null
    }
}

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: Token.getToken(),
            userName: '',
            userEmail: '',
            userId: '',
        };
        console.log('this.state', this.state);
        this.getUserInfo = this.getUserInfo.bind(this);
    }

    getUserInfo() {
        if (this.state.token)
            getAuthUser(this.state.token).then((data) => {
                this.setState({userEmail: data.result.email, userName: data.result.email, userId: data.result.id});
            })
    }

    initData() {
        if (this.props.match) {
            let param = {
                id: this.props.match.params.Id
            };
            // TODO
        } else {

        }
    }

    componentDidMount() {
        this.getUserInfo()
    }

    render() {
        return (
            <div>
                <h3 className="userRequestTitle">{this.state.userName}'s requested</h3>
                <div id="userRequests">
                    <UserRequests />
                </div>
                <h3 className="userRequestTitle">{this.state.userName}'s trips</h3>
                <UserTrips />
            </div>
        )
    }
}


class ProfileLayout extends React.Component {
    render() {
        return (
            <div className="itemsListWrap profileWrap">
                <div className="overflowFixBeta">
                    <div className="container">
                        <div className="table">
                            <div className="leftSide">
                                <img src="https://a0.muscache.com/im/pictures/90aef051-f5b7-471a-b4f2-fbb3f5e5fb89.jpg?aki_policy=profile_x_medium"/>
                                <h1>Yuho</h1>
                                <p>10 Bought</p>
                                <p>1 Delivered</p>
                            </div>
                            <div className="contentWrap tableCell full vatop">
                                <div className="content colWrap productList">
                                    <Profile />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default ProfileLayout;