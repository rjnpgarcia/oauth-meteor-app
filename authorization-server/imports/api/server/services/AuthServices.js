import AuthHandler from "../../classes/server/AuthHandler";
// import { HTTP } from "meteor/http";

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
    }

    // authorizeOauth: function (data) {
    //     const { params, token } = data;
    //     const oauth2ServerEndpoint = "http://localhost:5000/oauth/authorize";
    //     try {
    //         const queryString = new URLSearchParams({
    //             ...params,
    //             token,
    //             allow: "yes"
    //         }).toString();
    //         console.log(queryString);
    //         const response = HTTP.post(oauth2ServerEndpoint, {
    //             headers: {
    //                 "Content-Type": "application/x-www-form-urlencoded"
    //             },
    //             content: queryString
    //         });
    //         console.log(response);
    //         return true;
    //     } catch (error) {
    //         console.error("Token Grant Error:", error);
    //         // Handle fetch errors
    //     }
    // }
};
