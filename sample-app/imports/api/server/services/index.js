import { Meteor } from "meteor/meteor";
import AuthServices from "./AuthServices";

if (Meteor.isServer) {
    Meteor.methods({
        ...AuthServices
    });
}
