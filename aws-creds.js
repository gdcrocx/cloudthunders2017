var aws = require('aws-sdk'),    
    config = require('../config');

aws.config.update({ region: 'us-east-1' });

exports.getS3Creds = function (){
    return new aws.S3();
}

exports.getEC2Creds = function (){
    return new aws.EC2();
}

exports.getRDSCreds = function (){
    return new aws.RDS();
}