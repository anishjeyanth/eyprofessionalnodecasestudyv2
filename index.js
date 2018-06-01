const CustomerService = require('./services').CustomerService;

async function main() {
    let customerServiceObject = new CustomerService();
    let filteredCustomers = await customerServiceObject.findCustomers('lan');

    for (let customer of filteredCustomers)
        console.log(customer.customerId + ', ' + customer.name);
}

main()
    .then(() => console.log('Test Completed!'));