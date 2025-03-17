import { check, Match } from "meteor/check";
// import { ServiceConfiguration } from "meteor/service-configuration";

class AuthHandler {
    #user;
    constructor(user) {
        this.#user = user;
    }

    async registerUser() {
        const { email, password } = this.#user;

        let userData = {};

        try {
            if (!email) {
                throw new Error("Please input email");
            }

            if (!password) {
                throw new Error("empty-password");
            }

            if (email) {
                check(email, String);
                check(
                    email,
                    Match.Where((value) => {
                        try {
                            check(value, String);
                            return /\S+@\S+\.\S+/.test(value); // Regular expression for email validation
                        } catch (e) {
                            throw new Error("invalid-email");
                        }
                    })
                );

                userData.email = email;
            }

            check(password, String);
            userData.password = password;

            userData.payRate = {
                monthly: 25000
            };

            const userId = await Accounts.createUser(userData);

            if (userId) {
                return userId;
            }
        } catch (error) {
            throw new Meteor.Error(
                "register-failed",
                error.reason
                    ? error.reason
                    : "Something went wrong. Please try again"
            );
        }
    }

    async loginUser() {
        const { email, password } = this.#user;

        try {
            check(email, String);
            check(password, String);

            const user = Meteor.users.findOne({
                "emails.address": email
            });
            if (!user) {
                throw new Error("User not found");
            }

            const loggedIn = await Accounts._checkPassword(user, password);
            if (loggedIn.error) {
                throw new Error("Incorrect username or password");
            }

            const userDetails = { email, password };

            return { login: true, user: userDetails };
        } catch (err) {
            throw new Error(err);
        }
    }

    loginWithOauth() {
        // const serviceProjection = {
        //     $set: {
        //         loginStyle: "popup",
        //         clientId: oauth.clientId,
        //         secret: oauth.secret,
        //         dialogUrl: oauth.dialogUrl,
        //         accessTokenUrl: oauth.accessTokenUrl,
        //         identityUrl: oauth.identityUrl,
        //         redirectUrl: oauth.redirectUrl
        //     }
        // };
        // ServiceConfiguration.configurations.upsert(
        //     serviceQuery,
        //     serviceProjection
        // );
    }
}

export default AuthHandler;
