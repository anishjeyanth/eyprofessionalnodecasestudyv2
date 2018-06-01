const DbConstants = require('../constants').DbConstants;

class Configuration {
    static get Host() {
        let host = process.env.MONGO_HOST || DbConstants.MONGO_HOST;

        return host;
    }

    static get Port() {
        let portNumber = process.env.MONGO_PORT || DbConstants.MONGO_PORT;

        return portNumber;
    }

    static get DbName() {
        let dbName = process.env.MONGO_DB || DbConstants.MONGO_DB;

        return dbName;
    }

    static get Credentials() {
        let userName = process.env.USER_NAME;
        let password = process.env.DB_PASSWORD;

        return {
            userName,
            password
        };
    }

    static get ConnectionString() {
        let connectionString = `mongodb://${Configuration.Host}:${Configuration.Port}/${Configuraiton.dbName}`;

        return connectionString;
    }
}