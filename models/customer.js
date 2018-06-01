const mongoose = require('mongoose');

const CustomerModel = {
    customerId: Number,
    name: String,
    address: String,
    credit: Number,
    status: Boolean,
    email: String,
    phone: String,
    remarks: String
};

module.exports = CustomerModel;