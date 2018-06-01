const DbService = require('./db-service');
const CustomerService = require('./customer-service');
const PushNotificationsService = require('./push-notifications-service');
const UserProfileService = require('./user-profile-service');
const AuthenticationService = require('./authentication-service');

module.exports = {
    DbService,
    CustomerService,
    PushNotificationsService,
    UserProfileService,
    AuthenticationService
};
