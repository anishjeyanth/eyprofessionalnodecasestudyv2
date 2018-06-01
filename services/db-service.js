const CustomerModel = require('../models').CustomerModel;

class DbService {
    constructor() {
        this.mongoose = require('mongoose');
        this.customers = this.mongoose.model('customers', CustomerModel);
    }

    get Connection() {
        return this.mongoose;
    }

    get Customers() {
        return this.customers;
    }
}

module.exports = DbService;
