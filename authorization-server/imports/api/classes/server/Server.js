import { Meteor } from "meteor/meteor";
import { OAuth2Server } from "meteor/leaonline:oauth2-server";
// import RedisVent from "./RedisVent";

class Server {
    #settings;
    #oauth2server;
    constructor(settings) {
        this.#settings = settings;
        this.initializeOauth();
    }

    get Config() {
        return this.#settings;
    }

    get Oauth2Svr() {
        return this.#oauth2server;
    }

    startup() {
        return Promise.all([
            this.registerClients(),
            this.createExampleUsers()
        ]).then(() => {
            // RedisVent.publish();
            console.log("Server started...");
        });
    }

    initializeOauth() {
        this.#oauth2server = new OAuth2Server({
            debug: true,
            serverOptions: {
                addAcceptedScopesHeader: true,
                addAuthorizedScopesHeader: true,
                allowBearerTokensInQueryString: false,
                allowEmptyState: false,
                authorizationCodeLifetime: 300,
                accessTokenLifetime: 3600,
                refreshTokenLifetime: 1209600,
                allowExtendedTokenAttributes: false,
                requireClientAuthentication: true
            },
            model: {
                accessTokensCollectionName: "oauth_access_tokens",
                refreshTokensCollectionName: "oauth_refresh_tokens",
                clientsCollectionName: "oauth_clients",
                authCodesCollectionName: "oauth_auth_codes",
                debug: true
            },
            routes: {
                accessTokenUrl: "/oauth/token",
                authorizeUrl: "/oauth/authorize",
                errorUrl: "/oauth/error",
                fallbackUrl: "/oauth/*"
            }
        });
        this.#oauth2server
            .authenticatedRoute()
            .get("/oauth/ident", function (req, res, next) {
                const user = Meteor.users.findOne(req.data.user.id);
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                console.info("get user", user);
                const body = user
                    ? JSON.stringify({
                          id: user._id,
                          login: user.username,
                          email: user.emails && user.emails[0]?.address
                          //   name: `${user.firstName} ${user.lastName}`
                      })
                    : "";
                res.end(body);
            });
        // create some fallback for all undefined routes
        this.#oauth2server.app.use("*", function (req, res, next) {
            res.writeHead(404);
            res.end("route not found");
        });
        // console.log(this.#oauth2server);
    }

    registerClients() {
        Object.values(Meteor.settings.clients).forEach((entry) => {
            console.log(`[OAuth2Server]: register client <${entry.title}>`);
            this.#oauth2server.registerClient(entry);
        });
    }

    createExampleUsers() {
        Object.values(Meteor.settings.accounts.fixtures).forEach((user) => {
            if (Accounts.findUserByEmail(user.email)) {
                return;
            }

            console.log("[Accounts]: create user", user.email);
            Accounts.createUser(user);
        });
    }
}

export default new Server(Meteor.settings);
