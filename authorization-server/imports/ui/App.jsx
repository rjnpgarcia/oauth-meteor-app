import React from "react";
import AuthWatcher from "../api/classes/client/AuthWatcher";
import { withTracker } from "meteor/react-meteor-data";
import Client from "../api/classes/client/Client";
const WatcherName = "Oauth";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isRegistering: false,
            notification: ""
        };
        AuthWatcher.setWatcher(this, WatcherName);
    }

    componentDidMount() {
        // const params = AuthWatcher.getParams();
        // this.setState({ data: params });
        AuthWatcher.getParams();
        AuthWatcher.getMeteorToken();
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleToggleMode = (e) => {
        this.setState((prevState) => ({
            isRegistering: !prevState.isRegistering
        }));
    };

    async handleSubmit(e) {
        e.preventDefault();

        const { email, password, isRegistering } = this.state;

        if (isRegistering) {
            try {
                const res = await AuthWatcher.registerUser({ email, password });
                if (res) {
                    this.setState({ notification: `Registration: ${res}` });
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            try {
                await AuthWatcher.loginUser({ email, password });
            } catch (err) {
                console.error(err);
            }
        }
    }

    async handleAuthorize() {
        await AuthWatcher.authorizeLoggedInAccount();
    }

    handleLogout(e) {
        Client.logout();
    }

    render() {
        const { email, password, isRegistering, notification } = this.state;
        const { isLoggedIn, userData, data } = this.props;
        return (
            <div>
                <h1>Authentication Service</h1>

                {isLoggedIn ? (
                    <>
                        <h3>
                            Sign-in as {userData && userData.emails[0].address}
                        </h3>
                        <form method="post" role="form">
                            <input type="hidden" name="allow" value="yes" />
                            <input
                                type="hidden"
                                name="token"
                                value={AuthWatcher.getMeteorToken()}
                            />
                            <input
                                type="hidden"
                                name="client_id"
                                value={data && data.client_id}
                            />
                            <input
                                type="hidden"
                                name="redirect_uri"
                                value={data && data.redirect_uri}
                            />
                            <input
                                type="hidden"
                                name="state"
                                value={data && data.state}
                            />
                            <input
                                type="hidden"
                                name="response_type"
                                value="code"
                            />
                            <button type="submit">Authorize</button>
                        </form>
                        <hr />
                        <button onClick={(e) => this.handleLogout(e)}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <form>
                            <label>
                                Email:
                                <input
                                    type="text"
                                    name="email"
                                    value={email}
                                    onChange={this.handleInputChange}
                                />
                            </label>
                            <br />
                            <label>
                                Password:
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={this.handleInputChange}
                                />
                            </label>
                            <br />
                            <button onClick={(e) => this.handleSubmit(e)}>
                                {isRegistering ? "Register" : "Login"}
                            </button>
                            {notification ? <p>{notification}</p> : ""}
                        </form>
                        <p>
                            {isRegistering
                                ? "Already have an account?"
                                : "Don't have an account?"}{" "}
                            <button onClick={(e) => this.handleToggleMode(e)}>
                                {isRegistering ? "Login" : "Register"}
                            </button>
                        </p>
                    </>
                )}
            </div>
        );
    }
}

export default withTracker((props) => {
    AuthWatcher.initiateWatch(WatcherName);
    AuthWatcher.initiateSubscription();
    const isLoggedIn = AuthWatcher.isLoggedIn;
    const userData = Client.User;
    const data = AuthWatcher.Params;
    return {
        data,
        userData,
        isLoggedIn
    };
})(App);
