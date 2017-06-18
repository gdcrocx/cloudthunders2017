var restClient = require('restify-clients'),
    awsCreds = require('./aws-creds'),
    config = require('../config');

function rdsUnencryptedDBInstances() {
    console.log("--rdsUnencryptedDBInstances--");
    rds = awsCreds.getRDSCreds();

    var params = {
    };

    rds.describeDBInstances(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred

        if (data) {            
            console.log("Total DB Instance(s) : " + data.DBInstances.length);
            counter = 0;
            for (i = 0; i < data.DBInstances.length; i++) {                              
                if (data.DBInstances[i].StorageEncrypted == false) { //Getting all unencrypted volumes
                    console.log("Unencrypted DB Instance Identifier: " + data.DBInstances[i].DBInstanceIdentifier);
                    counter++;
                }
            }
            console.log("Total Unencrypted DB Instance(s): " + counter);
        }
    });
}
//rdsUnencryptedDBInstances();