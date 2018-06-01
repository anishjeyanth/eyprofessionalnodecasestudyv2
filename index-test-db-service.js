const DbService = require('./services').DbService;
const {
    getConfiguration,
    setConfiguration,
    ConfigurationTypes
} = require('./configuration');

async function main() {
    let dbServiceObject = null;

    try {
        setConfiguration(ConfigurationTypes.DEVELOPMENT);
        
        let configuration = getConfiguration();

        dbServiceObject = new DbService();
        
        await dbServiceObject.Connection.connect(configuration.ConnectionString);

        let filteredCustomer = await dbServiceObject.Customers.findOne({ customerId: 1 });

        console.log(JSON.stringify(filteredCustomer));
    } catch (error) {
        console.log(`Error Occurred, Details : ${JSON.stringify(error)}`);
    }
    finally {
        await dbServiceObject.Connection.disconnect();
    }
}

main()
    .then(() => console.log('Program Completed!'));