const { DbConstants, ServiceListenerConstants } = require('../constants');

class Configuration {
    static get Host() {
        let host = process.env.MONGO_HOST || DbConstants.MONGO_HOST;

        return host.trim();
    }

    static get Port() {
        let portNumber = process.env.MONGO_PORT || DbConstants.MONGO_PORT;

        return portNumber.toString().trim();
    }

    static get DbName() {
        let dbName = process.env.MONGO_DB || DbConstants.MONGO_DB;

        return dbName.trim();
    }

    static get IsStaticContentsEnabled() {
        let staticContentsEnabled =
            process.env.ENABLE_STATIC_CONTENTS || ServiceListenerConstants.DEFAULT_STATIC_CONTENTS_FLAG;

        return staticContentsEnabled;
    }

    static get Credentials() {
        let userName = process.env.USER_NAME;
        let password = process.env.DB_PASSWORD;

        if (password) {
            password = Buffer.from(password, "base64").toString();
        }

        return {
            userName,
            password
        };
    }

    static get ServiceListenerPort() {
        let serviceListenerPort = process.env.SERVICE_PORT || ServiceListenerConstants.DEFAULT_SERVICE_PORT;

        return serviceListenerPort;
    }

    static get GlobalSecretKey() {
        let secretKey = process.env.SECRET_KEY || ServiceListenerConstants.GLOBAL_SECRET_KEY;

        return secretKey.trim();
    }

    static get ConnectionString() {
        let connectionString = '';
        let validation = Configuration.Credentials &&
            Configuration.Credentials.userName && Configuration.Credentials.password;

        if (validation)
            connectionString = `mongodb://${Configuration.Credentials.userName}:${Configuration.Credentials.password}@${Configuration.Host}:${Configuration.Port}/${Configuration.DbName}?ssl=true`;
        else
            connectionString = `mongodb://${Configuration.Host}:${Configuration.Port}/${Configuration.DbName}`;

        return connectionString;
    }
}

module.exports = Configuration;
