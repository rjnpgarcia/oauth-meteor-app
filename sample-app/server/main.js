import { Meteor } from "meteor/meteor";
import Server from "../imports/api/classes/server/Server";
import "../imports/api/server/services";
import { ServiceConfiguration } from "meteor/service-configuration";

const { oauth } = Meteor.settings;
const serviceQuery = { service: "lea" };

const serviceProjection = {
    $set: {
        loginStyle: "popup",
        clientId: oauth.clientId,
        secret: oauth.secret,
        dialogUrl: oauth.dialogUrl,
        accessTokenUrl: oauth.accessTokenUrl,
        identityUrl: oauth.identityUrl,
        redirectUrl: oauth.redirectUrl
    }
};

ServiceConfiguration.configurations.upsert(serviceQuery, serviceProjection);

Meteor.publish(null, function () {
    const userId = Meteor.userId();
    // if (!userId) return this.ready();

    const fields = { "services.lea.email": 1 };
    return Meteor.users.find({ _id: userId }, { fields });
});

Meteor.startup(async () => {
    Server.startup();
});
