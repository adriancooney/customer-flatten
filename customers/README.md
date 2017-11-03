# find-customers
Find Intercom customers within 100km of their offices for a party.

### Usage
To output the customers in CSV within 100km of the Intercom Dublin offices, execute the `bin/find-customers.js` file with Node (v8.4 and up) with a path to the input customer data:

    $ node bin/find-customers.js data/customers.log
    name,user_id
    "Ian Kehoe",4
    "Nora Dempsey",5
    "Theresa Enright",6
    "Eoin Ahearn",8
    "Richard Finnegan",11
    "Christina McArdle",12
    "Olive Ahearn",13
    "Michael Ahearn",15
    "Patricia Cahill",17
    "Eoin Gallagher",23
    "Rose Enright",24
    "Stephen McArdle",26
    "Oliver Ahearn",29
    "Nick Enright",30
    "Alan Behan",31
    "Lisa Ahearn",39

### Testing
Install the development dependencies with `yarn` or `npm`:

    $ yarn

And execute the Jest test suite:

    $ npm test

To lint the files:

    $ npm run lint

License: MIT
