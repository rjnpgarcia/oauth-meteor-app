import { Meteor } from "meteor/meteor";
import { AUTH } from "../common/const";
import Client from "./Client";
import Watcher from "./Watcher";

class AuthWatcher extends Watcher {
    #params;
    constructor(parent) {
        super(parent);
    }

    get isLoggedIn() {
        return Meteor.userId();
    }

    get Params() {
        return this.#params;
    }

    async registerUser(data) {
        try {
            const res = await this.Parent.callFunc(AUTH.REGISTER, data);
            console.log(res);
            return res;
        } catch (err) {
            throw new Error(err);
        }
    }

    async loginUser(data) {
        try {
            const res = await this.Parent.callFunc(AUTH.LOGIN, data);
            if (res.login) {
                this.Parent.login(res.user.email, res.user.password);
                this.getParams();
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    getParams() {
        try {
            const searchParams = new URLSearchParams(window.location.search);
            const queryParams = Object.fromEntries(searchParams.entries());
            const data = { ...queryParams, allow: "yes" };
            this.#params = data;
        } catch (error) {
            throw new Error(error);
        }
    }

    getMeteorToken() {
        const meteorToken = window.localStorage.getItem("Meteor.loginToken");
        return meteorToken;
    }

    initiateSubscription() {
        return this.subscribe("authorizedOAuth");
    }

    // async authorizeLoggedInAccount() {
    //     try {
    //         const searchParams = new URLSearchParams(window.location.search);
    //         const queryParams = Object.fromEntries(searchParams.entries());
    //         const { state } = queryParams;
    //         const meteorToken =
    //             window.localStorage.getItem("Meteor.loginToken");

    //         // const res = await this.Parent.callFunc(AUTH.AUTHORIZE, {
    //         //     params: queryParams,
    //         //     token: meteorToken
    //         // });
    //         // console.log(res);
    //         // window.location.href = "http://localhost:4000/_oauth/lea";

    //         const oauth2ServerEndpoint =
    //             "http://localhost:5000/oauth/authorize";
    //         // Construct the query string with URL parameters
    //         const queryString = new URLSearchParams({
    //             ...queryParams,
    //             token: meteorToken,
    //             allow: "yes"
    //         }).toString();
    //         const response = await fetch(oauth2ServerEndpoint, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/x-www-form-urlencoded"
    //             },
    //             body: queryString
    //         });

    //         console.log(response);
    //         this.activateWatcher();
    //     } catch (error) {
    //         throw new Error(error);
    //     }
    // }
}

export default new AuthWatcher(Client);
