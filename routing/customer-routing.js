const express = require('express');
const CustomerService = require('../services').CustomerService;
const { ErrorConstants, GeneralConstants, HttpStatusConstants, PushNotificationEventConstants } = require('../constants');

class CustomerRouting {
    constructor(pushNotificationsService) {
        if (!pushNotificationsService) {
            throw new Error(ErrorConstants.INVALID_ARGUMENTS);
        }

        this.pushNotificationsService = pushNotificationsService;
        this.router = express.Router();
        this.customerService = new CustomerService();

        this.initializeRouting();
    }

    initializeRouting() {
        this.router.get('/', async (request, response) => {
            try {
                let customers = await this.customerService.getCustomers();
                let updatedCustomers = [];

                for (let customer of customers) {
                    let updatedCustomer = {
                        id: customer.customerId,
                        name: customer.name,
                        address: customer.address,
                        credit: customer.credit,
                        status: customer.status,
                        remarks: customer.remarks,
                        email: customer.email,
                        phone: customer.phone
                    };

                    updatedCustomers.push(updatedCustomer);
                }

                response
                    .status(HttpStatusConstants.OK)
                    .send(updatedCustomers);
            } catch (error) {
                console.log(`Error Occurred in handling HTTP Request ... Details : ${JSON.stringify(error)}`);

                response
                    .status(HttpStatusConstants.INTERNAL_SERVER_ERROR)
                    .send({
                        reason: JSON.stringify(error)
                    });
            }
        });

        this.router.get('/detail/:customerId', async (request, response) => {
            let customerId = request.params.customerId;
            let validation = customerId && customerId >= GeneralConstants.MIN_CUSTOMER_ID;

            if (!validation) {
                response
                    .status(HttpStatusConstants.BAD_REQUEST)
                    .send({
                        reason: ErrorConstants.INVALID_ARGUMENTS
                    });

                return;
            }

            try {
                let filteredCustomer = await this.customerService.getCustomerById(customerId);

                if (!filteredCustomer) {
                    response
                        .status(HttpStatusConstants.NOT_FOUND);
                } else {
                    response
                        .status(HttpStatusConstants.OK)
                        .send(filteredCustomer);
                }
            } catch (error) {
                console.log(`Error Occurred in handling HTTP Request ... Details : ${JSON.stringify(error)}`);

                response
                    .status(HttpStatusConstants.INTERNAL_SERVER_ERROR)
                    .send({
                        reason: JSON.stringify(error)
                    });
            }
        });

        this.router.get('/search/:searchString', async (request, response) => {
            let searchString = request.params.searchString;
            let validation = searchString && searchString.length >= GeneralConstants.MIN_SEARCH_LENGTH;

            if (!validation) {
                response
                    .status(HttpStatusConstants.BAD_REQUEST)
                    .send({
                        reason: ErrorConstants.INVALID_ARGUMENTS
                    });

                return;
            }

            try {
                let filteredCustomers = await this.customerService.findCustomers(searchString);

                response
                    .status(HttpStatusConstants.OK)
                    .send(filteredCustomers);
            } catch (error) {
                console.log(`Error Occurred in handling HTTP Request ... Details : ${JSON.stringify(error)}`);

                response
                    .status(HttpStatusConstants.INTERNAL_SERVER_ERROR)
                    .send({
                        reason: JSON.stringify(error)
                    });
            }
        });

        this.router.post('/', async (request, response) => {
            let body = request.body;
            let validation = body && (body.customerId || body.id) && body.name &&
                body.address && body.credit && body.email && body.phone && body.remarks;

            if (!validation) {
                response
                    .status(HttpStatusConstants.BAD_REQUEST)
                    .send({
                        reason: ErrorConstants.BUSINESS_VALIDATION_FAILED
                    });

                return;
            }

            try {
                let customer = {
                    customerId: body.customerId || body.id,
                    name: body.name,
                    address: body.address,
                    credit: body.credit,
                    status: body.status,
                    email: body.email,
                    phone: body.phone,
                    remarks: body.remarks
                };

                let savedCustomerRecord = await this.customerService.saveCustomerRecord(customer);
                let postSaveValidation = savedCustomerRecord && savedCustomerRecord["_id"]

                if (!postSaveValidation) {
                    response
                        .status(HttpStatusConstants.INTERNAL_SERVER_ERROR)
                        .send({
                            reason: ErrorConstants.BUSINESS_VALIDATION_FAILED
                        });
                } else {
                    if (this.pushNotificationsService) {
                        let notificationData = {
                            id: savedCustomerRecord.customerId,
                            name: savedCustomerRecord.name,
                            address: savedCustomerRecord.address,
                            credit: savedCustomerRecord.credit,
                            status: savedCustomerRecord.status,
                            remarks: savedCustomerRecord.remarks,
                            email: savedCustomerRecord.email,
                            phone: savedCustomerRecord.phone
                        };

                        this.pushNotificationsService.notifySocketClients(
                            PushNotificationEventConstants.NEW_CUSTOMER, notificationData);
                    }

                    response
                        .status(HttpStatusConstants.CREATED)
                        .send(savedCustomerRecord);
                }
            } catch (error) {
                console.log(`Error Occurred in handling HTTP Request ... Details : ${JSON.stringify(error)}`);

                response
                    .status(HttpStatusConstants.INTERNAL_SERVER_ERROR)
                    .send({
                        reason: JSON.stringify(error)
                    });
            }
        });
    }

    get Router() {
        return this.router;
    }
}

module.exports = CustomerRouting;
