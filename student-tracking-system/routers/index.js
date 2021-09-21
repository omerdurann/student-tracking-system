const app = require("./app");
const api = require("./api");
const auth=require('./auth');

exports.auth=auth.auth;
exports.app = app.app;
exports.api = api.api;