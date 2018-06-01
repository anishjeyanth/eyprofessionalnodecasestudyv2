const DbService = require('./db-service');
const { ErrorConstants, GeneralConstants } = require('../constants')
const Configuration = require('../configuration').getConfiguration();

class CustomerService {
    constructor() {
        this.dbService = new DbService();
    }

    async connect() {
        await this.dbService.Connection.connect(Configuration.ConnectionString);
    }

    async disconnect() {
        await this.dbService.Connection.disconnect();
    }

    async getCustomers() {
        let customers = [];

        try {
            await this.connect();

            customers = await this.dbService.Customers.find({});
        } catch (error) {
            console.log(`Error Occurred, Details : ${JSON.stringify(error)}`);

            throw error;
        }
        finally {
            await this.disconnect();
        }

        return customers;
    }

    async findCustomers(customerName) {
        let validation = customerName && customerName.length >= GeneralConstants.MIN_SEARCH_LENGTH;

        if (!validation)
            throw new Error(ErrorConstants.BUSINESS_VALIDATION_FAILED);

        let filteredCustomers = [];

        try {
            await this.connect();

            filteredCustomers = await this.dbService.Customers.find({
                name: new RegExp(customerName, 'i')
            });
        } catch (error) {
            console.log(`Error Occurred, Details : ${JSON.stringify(error)}`);

            throw error;
        }
        finally {
            await this.disconnect();
        }

        return filteredCustomers;
    }

    async getCustomerById(customerId) {
        let validation = customerId && customerId >= GeneralConstants.MIN_CUSTOMER_ID;

        if (!validation)
            throw new Error(ErrorConstants.BUSINESS_VALIDATION_FAILED);

        let filteredCustomer = null;

        try {
            await this.connect();

            filteredCustomer = await this.dbService.Customers.findOne({
                customerId: customerId
            });
        } catch (error) {
            console.log(`Error Occurred, Details : ${JSON.stringify(error)}`);

            throw error;
        }
        finally {
            await this.disconnect();
        }

        return filteredCustomer;
    }

    async saveCustomerRecord(customer) {
        let validation = customer && customer.customerId &&
            customer.name && customer.address && customer.email &&
            customer.phone && customer.remarks;

        if (!validation)
            throw new Error(ErrorConstants.INVALID_ARGUMENTS);

        let savedCustomerRecord = null;

        try {
            await this.connect();

            savedCustomerRecord = await this.dbService.Customers.create(customer);
        } catch (error) {
            console.log(`Error Occurred, Details : ${JSON.stringify(error)}`);

            throw error;
        }
        finally {
            await this.disconnect();
        }

        return savedCustomerRecord;
    }
}

module.exports = CustomerService;
