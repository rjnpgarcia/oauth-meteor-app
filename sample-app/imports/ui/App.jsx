import React from "react";
import AuthWatcher from "../api/classes/client/AuthWatcher";
import Client from "../api/classes/client/Client";
import { withTracker } from "meteor/react-meteor-data";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isRegistering: false,
            notification: ""
        };
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
                AuthWatcher.loginUser({ email, password });
            } catch (err) {
                console.error(err);
            }
        }
    }

    handleLoginWithOauth(e) {
        e.preventDefault();
        AuthWatcher.loginWithOauth();
    }

    handleLogout(e) {
        e.preventDefault();
        Client.logout();
    }

    render() {
        const { isLoggedIn, userData } = this.props;

        return (
            <div>
                <h1>OAUTH APP</h1>
                {isLoggedIn ? (
                    <>
                        <h3 style={{ color: "blue" }}>
                            Hello {userData && userData.services.lea.email}
                        </h3>
                        <button onClick={(e) => this.handleLogout(e)}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <h3>Login with oauth service</h3>
                        <button onClick={(e) => this.handleLoginWithOauth(e)}>
                            Login with oauth
                        </button>
                    </>
                )}
            </div>
        );
    }
}

export default withTracker((props) => {
    const isLoggedIn = AuthWatcher.isLoggedIn;
    const userData = Client.User;
    return {
        userData,
        isLoggedIn
    };
})(App);
