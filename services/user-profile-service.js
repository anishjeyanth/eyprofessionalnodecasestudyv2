const { UserProfile } = require('../models');
const { ErrorConstants } = require('../constants');

class UserProfileService {
    constructor() {
        this.registeredUserProfiles =
            [
                new UserProfile('USR100011', 'admin@123', 'user100011@email-info.com', 'Marketing Executive', true),
                new UserProfile('USR100012', 'admin@123', 'user100012@email-info.com', 'Marketing Executive', true),
                new UserProfile('USR100013', 'admin@123', 'user100013@email-info.com', 'Marketing Executive', true),
                new UserProfile('USR100014', 'admin@123', 'user100014@email-info.com', 'Marketing Executive', true),
                new UserProfile('USR100015', 'admin@123', 'user100015@email-info.com', 'Marketing Executive', true),
                new UserProfile('USR100016', 'admin@123', 'user100016@email-info.com', 'Marketing Executive', true),
                new UserProfile('USR100017', 'admin@123', 'user100017@email-info.com', 'Marketing Executive', true),
                new UserProfile('USR100018', 'admin@123', 'user100018@email-info.com', 'Marketing Executive', false)
            ];
    }

    getUserProfile(userProfileId) {
        let promise = new Promise(
            (resolve, reject) => {
                let filteredUserProfile = null;

                for (let userProfile of this.registeredUserProfiles) {
                    if (userProfile.userProfileId === userProfileId) {
                        filteredUserProfile = userProfile;

                        break;
                    }
                }

                let validation = userProfileId && filteredUserProfile;

                if (!validation) {
                    reject({
                        reason: ErrorConstants.INVALID_USER_PROFILE
                    });

                    return;
                }

                resolve(filteredUserProfile);
            });

        return promise;
    }
}

module.exports = UserProfileService;
