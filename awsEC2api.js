var restClient = require('restify-clients'),
    awsCreds = require('./aws-creds'),
    config = require('../config');

function ec2UnencryptedVolumes() {
    console.log("--ec2UnencryptedVolumes--");
    ec2 = awsCreds.getEC2Creds();

    var params = {
    };

    ec2.describeVolumes(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred

        if (data) {
            console.log("Total EC2 EBS Volume(s) : " + data.Volumes.length);
            counter = 0;
            for (i = 0; i < data.Volumes.length; i++) {
                if (data.Volumes[i].Encrypted == false) { //Getting all unencrypted volumes
                    console.log("Unencrypted Volume ID: " + data.Volumes[i].VolumeId);
                    counter++;
                }
            }
            console.log("Total Unencrypted Volume(s): " + counter);
        }
    });

    nostop = 0;
    var params = {
        Filters: [
            {
                Name: 'tag:Vsad',
                Values: [
                    'VQEV'
                ]
            }
        ],
        InstanceIds: [
            instanceId
        ]
    }

    ec2.describeInstances(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred

        if (data) {
            counter = 0;
            for (i = 0; i < data.Reservations.length; i++) {
                for (j = 0; j < data.Reservations[i].Instances.length; j++) {
                    for (k = 0; k < data.Reservations[i].Instances[j].Tags.length; k++) {
                        if (data.Reservations[i].Instances[j].Tags[k].Key == "nostop") {
                            console.log("This instance can't be stopped.")
                            nostop = 1;
                        }
                    }
                }
            }
        }
    });
}
ec2UnencryptedVolumes();