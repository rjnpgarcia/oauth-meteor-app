import { Meteor } from "meteor/meteor";
import AuthHandler from "../../classes/server/AuthHandler";

export default {
    registerUser: async function (user) {
        try {
            const auth = new AuthHandler(user);
            const userId = await auth.registerUser();
            console.log(`Successfully registered ${userId}`);
            return userId;
        } catch (error) {
            console.error(error);
            return error.reason;
        }
    },

    loginUser: async function (user) {
        try {
            const auth = new AuthHandler(user);
            const res = auth.loginUser();
            return res;
        } catch (error) {
            console.error(error);
            return error.reason;
        }
    },
    loginWithOauth: function () {
        const auth = new AuthHandler(user);
        auth.loginWithOauth();
    }
};
