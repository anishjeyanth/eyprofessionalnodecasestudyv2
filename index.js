const { ServiceListenerConstants } = require('./constants');
const { SingleInstanceHosting } = require('./hosting');
const { setConfiguration, getConfiguration, ConfigurationTypes } = require('./configuration');

async function main() {
    try {
        setConfiguration(ConfigurationTypes.DEVELOPMENT);

        const Configuration = getConfiguration();
        const portNumber = Configuration.ServiceListenerPort;
        const isStaticContentsEnabled = Configuration.IsStaticContentsEnabled;
        const globalSecretKey = Configuration.GlobalSecretKey;
        const hostingObject = new SingleInstanceHosting(
            portNumber, isStaticContentsEnabled, globalSecretKey);
        const stopServer = async () => {
            await hostingObject.stopServer();

            console.log('Server Stopped Successfully ...');

            process.exit();
        };

        await hostingObject.startServer();

        console.log('Server Started Successfully ...');

        process.on('exit', stopServer);
        process.on('SIGTERM', stopServer);
        process.on('SIGINT', stopServer);
    } catch (error) {
        console.log(`Error Occurred in Main(), Details : ${JSON.stringify(error)}`);
    }
}

main()
    .then(() => console.log('End of the application ... Press [Ctrl+c] to Close the application!'));
