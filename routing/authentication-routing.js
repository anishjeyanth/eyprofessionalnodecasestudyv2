const express = require('express');
const jwt = require('jsonwebtoken');
const { UserProfileService, AuthenticationService } = require('../services');
const { ErrorConstants, HttpStatusConstants } = require('../constants');

class AuthenticationRouting {
    constructor(jwtSecretKey) {
        if (!jwtSecretKey) {
            throw new Error(ErrorConstants.INVALID_ARGUMENTS);
        }

        this.jwtSecretKey = jwtSecretKey;
        this.userProfileService = new UserProfileService();
        this.authenticationService = new AuthenticationService();
        this.router = express.Router();

        this.initializeRouting();
    }

    initializeRouting() {
        this.router.post('/', async (request, response) => {
            let userName = request.body.userProfileId || request.body.userId;
            let password = request.body.password;
            let validation = userName && password;

            if (!validation) {
                response
                    .status(HttpStatusConstants.BAD_REQUEST)
                    .send({
                        reason: ErrorConstants.INVALID_ARGUMENTS
                    });

                return;
            }

            let authenticatedProfile = await this.authenticationService.authenticate(userName, password);

            if (authenticatedProfile) {
                let payload = {
                    userProfileId: authenticatedProfile.userProfileId,
                    email: authenticatedProfile.email,
                    title: authenticatedProfile.title,
                    isActive: authenticatedProfile.isActive
                };

                let token = jwt.sign(payload, this.jwtSecretKey);

                response
                    .status(HttpStatusConstants.OK)
                    .send({
                        token
                    });
            } else {
                response
                    .status(HttpStatusConstants.AUTHORIZATION_FAILURE)
                    .send({
                        reason: ErrorConstants.INVALID_CREDENTIALS
                    });
            }
        });
    }

    get Router() {
        return this.router;
    }
}

module.exports = AuthenticationRouting;
