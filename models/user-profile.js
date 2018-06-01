const ObjectFormatter = require('../utilities').ObjectFormatter;

class UserProfile {
    constructor(userProfileId, password, email, title, isActive) {
        [
            this.userProfileId, this.password,
            this.email, this.title, this.isActive
        ] = arguments;
    }

    toString() {
        return ObjectFormatter.format(this);
    }
}

module.exports = UserProfile;
