const UserProfileService = require('./user-profile-service');
const { ErrorConstants } = require('../constants');

class AuthenticationService {
    constructor() {
        this.userProfileService = new UserProfileService();
    }

    async authenticate(userName, password) {
        let userProfile = await this.userProfileService.getUserProfile(userName);

        if (!userProfile) {
            throw new Error(ErrorConstants.INVALID_ARGUMENTS);
        }

        let authenticationStatus = userProfile.userProfileId === userName &&
            userProfile.password === password;

        if (!authenticationStatus) {
            throw new Error(ErrorConstants.INVALID_CREDENTIALS);
        }

        return userProfile;
    }
}

module.exports = AuthenticationService;
