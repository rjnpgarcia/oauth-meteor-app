import { Meteor } from "meteor/meteor";
import { AUTH } from "../common/const";
import Client from "./Client";
import Watcher from "./Watcher";

class AuthWatcher extends Watcher {
    constructor(parent) {
        super(parent);
    }

    get isLoggedIn() {
        return Meteor.userId();
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
            // console.log(res);
            if (res.login) {
                this.Parent.login(res.user.email, res.user.password);
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    loginWithOauth() {
        try {
            Meteor.loginWithLea((err) => {
                if (err) {
                    alert(err.message);
                }
                console.log(Meteor.userId());
            });
        } catch (err) {
            throw new Error(err);
        }
    }
}

export default new AuthWatcher(Client);
