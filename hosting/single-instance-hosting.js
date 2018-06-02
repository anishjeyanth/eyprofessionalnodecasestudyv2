const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const { CustomerRouting, AuthenticationRouting } = require('../routing');
const { ServiceUrlConstants, ErrorConstants, HttpStatusConstants } = require('../constants');
const { PushNotificationsService } = require('../services');

const PUBLIC_FOLDER = './public';

class SingleInstanceHosting {
    constructor(portNumber, enableStaticContents, jwtSecretKey) {
        if (!portNumber) {
            throw new Error(ErrorConstants.INVALID_ARGUMENTS);
        }

        if (!jwtSecretKey) {
            throw new Error(ErrorConstants.INVALID_SECRET_KEY);
        }

        this.jwtSecretKey = jwtSecretKey;
        this.enableStaticContents = enableStaticContents;
        this.portNumber = portNumber;
        this.expressApp = express();
        this.httpServer = http.createServer(this.expressApp);
        this.pushNotificationsService = new PushNotificationsService(this.httpServer);
        this.customerRouting = new CustomerRouting(this.pushNotificationsService);
        this.authenticationRouting = new AuthenticationRouting(this.jwtSecretKey);

        this.initializeMiddleware();
    }

    initializeMiddleware() {
        this.enableUnauthorizedErrorHandler();
        this.enableCors();

        this.expressApp.use(bodyParser.json());
        // this.expressApp.use(ServiceUrlConstants.CUSTOMERS, expressJwt({
        //     secret: this.jwtSecretKey
        // }));

        this.expressApp.use(ServiceUrlConstants.CUSTOMERS, this.customerRouting.Router);
        this.expressApp.use(ServiceUrlConstants.AUTHENTICATION, this.authenticationRouting.Router);

        if (this.enableStaticContents) {
            this.expressApp.use('/', express.static(PUBLIC_FOLDER));
        }
    }

    enableUnauthorizedErrorHandler() {
        this.expressApp.use(
            (error, request, response, next) => {
                if (error && error.constructor.name === 'UnauthorizedError') {
                    response.status(
                        HttpStatusConstants.AUTHORIZATION_FAILURE)
                        .send({
                            reason: ErrorConstants.INVALID_CREDENTIALS
                        });

                    return;
                }

                next();
            });
    }

    enableCors() {
        this.expressApp.use(
            (request, response, next) => {
                response.header('Access-Control-Allow-Credentials', 'true');
                response.header('Access-Control-Allow-Origin', '*');
                response.header('Access-Control-Allow-Methods', '*');
                response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

                next();
            });
    }

    startServer() {
        let promise = new Promise(
            (resolve, reject) => {
                this.httpServer.listen(
                    this.portNumber, () => resolve());
            });

        return promise;
    }

    stopServer() {
        let promise = new Promise(
            (resolve, reject) => {
                this.httpServer.close(() => resolve());
            });

        return promise;
    }
}

module.exports = SingleInstanceHosting;
