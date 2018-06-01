const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const CustomerRouting = require('../routing').CustomerRouting;
const { ServiceUrlConstants, ErrorConstants } = require('../constants');

class SingleInstanceHosting {
    constructor(portNumber) {
        if (!portNumber) {
            throw new Error(ErrorConstants.INVALID_ARGUMENTS);
        }

        this.portNumber = portNumber;
        this.expressApp = express();
        this.httpServer = http.createServer(this.expressApp);
        this.customerRouting = new CustomerRouting();

        this.initializeMiddleware();
    }

    initializeMiddleware() {
        this.enableCors();
        
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(ServiceUrlConstants.CUSTOMERS, this.customerRouting.Router);
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
