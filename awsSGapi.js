var restClient = require('restify-clients'),
    awsCreds = require('./aws-creds'),
    config = require('../config');

function sgOpenIngressNonHttpPorts() {
    console.log("--sgOpenIngressNonHttpPorts--");
    ec2 = awsCreds.getEC2Creds();
    var counter = 0;
    var params = {
    }
    ec2.describeSecurityGroups(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred

        if (data) {
            console.log("Total Security Groups(s): " + data.SecurityGroups.length);
            // console.log(data);
            for (i = 0; i < data.SecurityGroups.length; i++) {
                // console.log(data.SecurityGroups[i].IpPermissions)
                for (j = 0; j < data.SecurityGroups[i].IpPermissions.length; j++) {
                    // console.log(data.SecurityGroups[i].IpPermissions[j].ToPort);
                    if (data.SecurityGroups[i].IpPermissions[j].ToPort != 80) {
                        console.log("Non-Compliant Non-Http Security Group Rule in Security Group ID: " + data.SecurityGroups[i].GroupId);
                        counter++;
                    }
                }
            }
            console.log("Total Non-Compliant Non-Http Security Group Rule(s): " + counter);
        }
    });
}
sgOpenIngressNonHttpPorts();