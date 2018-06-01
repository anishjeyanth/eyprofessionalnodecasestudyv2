const ErrorConstants = require('../constants').ErrorConstants;
const ConfigurationTypes = require('./configuration-types');
const Configuration = require('./dev-configuration');

let currentConfigurationType = ConfigurationTypes.DEVELOPMENT;

const getConfiguration = () => {
    if (currentConfigurationType === ConfigurationTypes.DEVELOPMENT) {
        return Configuration;
    }

    throw new Error(ErrorConstants.UNSUPPORTED_FEATURE);
};

const setConfiguration = (configurationType = ConfigurationTypes.DEVELOPMENT) => {
    currentConfigurationType = configurationType;
};

module.exports = {
    getConfiguration,
    setConfiguration,
    ConfigurationTypes
};
