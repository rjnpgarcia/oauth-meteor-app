import { Meteor } from "meteor/meteor";
import Server from "../imports/api/classes/server/Server";
import "../imports/api/server/services";
import { OAuth2Server } from "meteor/leaonline:oauth2-server";

// const oauth2server = new OAuth2Server({
//     debug: true,
//     serverOptions: {
//         addAcceptedScopesHeader: true,
//         addAuthorizedScopesHeader: true,
//         allowBearerTokensInQueryString: false,
//         allowEmptyState: false,
//         authorizationCodeLifetime: 300,
//         accessTokenLifetime: 3600,
//         refreshTokenLifetime: 1209600,
//         allowExtendedTokenAttributes: false,
//         requireClientAuthentication: true
//     },
//     model: {
//         accessTokensCollectionName: "oauth_access_tokens",
//         refreshTokensCollectionName: "oauth_refresh_tokens",
//         clientsCollectionName: "oauth_clients",
//         authCodesCollectionName: "oauth_auth_codes",
//         debug: true
//     },
//     routes: {
//         accessTokenUrl: "/oauth/token",
//         authorizeUrl: "/oauth/authorize",
//         errorUrl: "/oauth/error",
//         fallbackUrl: "/oauth/*"
//     }
// });
// oauth2server
//     .authenticatedRoute()
//     .get("/oauth/ident", function (req, res, next) {
//         const user = Meteor.users.findOne(req.data.user.id);
//         res.writeHead(200, {
//             "Content-Type": "application/json"
//         });
//         console.info("get user", user);
//         const body = user
//             ? JSON.stringify({
//                   id: user._id,
//                   login: user.username,
//                   email: user.emails && user.emails[0]?.address,
//                   name: `${user.firstName} ${user.lastName}`
//               })
//             : "";

//         res.end(body);
//     });

// // create some fallback for all undefined routes
// oauth2server.app.use("*", function (req, res, next) {
//     res.writeHead(404);
//     res.end("route not found");
// });

// const registerClients = function () {
//     Object.values(Meteor.settings.clients).forEach((entry) => {
//         console.log(`[OAuth2Server]: register client <${entry.title}>`);
//         oauth2server.registerClient(entry);
//     });
// };

Meteor.startup(async () => {
    // registerClients();
    Server.startup();
});
