var restClient = require('restify-clients'),
    awsCreds = require('./aws-creds'),
    config = require('../config');

function s3GlobalAcls() {
    console.log("--s3GlobalAcls--");
    s3 = awsCreds.getS3Creds();
    var nonCompliantBucketCounter = 0;
    s3.listBuckets(function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred

        if (data) {
            console.log("Total Bucket(s): " + data.Buckets.length);

            for (i = 0; i < data.Buckets.length; i++) {

                var params = {
                    Bucket: data.Buckets[i].Name
                }

                s3.getBucketAcl(params, function (err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    if (data) {
                        nonCompliantBucketCounter = 0;
                        for (i = 0; i < data.Grants.length; i++) {
                            if (data.Grants[i].Grantee.Type == "Group") {
                                if (data.Grants[i].Grantee.URI == "http://acs.amazonaws.com/groups/global/AllUsers" || data.Grants[i].Grantee.URI == "http://acs.amazonaws.com/groups/global/AuthenticatedUsers") {
                                    nonCompliantBucketCounter++;
                                }
                            }
                        }
                    }
                    console.log(nonCompliantBucketCounter);
                    return nonCompliantBucketCounter;
                })
                console.log("Outside: " + nonCompliantBucketCounter);
            }
            console.log("Total Globally Permissioned Bucket(s): " + nonCompliantBucketCounter);
        }
    });
}
function s3UnencryptedBuckets() {
    console.log("--s3UnencryptedBuckets--");
    s3 = awsCreds.getS3Creds();
    var counter = 0;
    s3.listBuckets(function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred

        if (data) {
            console.log("Total Bucket(s): " + data.Buckets.length);

            for (i = 0; i < data.Buckets.length; i++) {

                var params = {
                    Bucket: data.Buckets[i].Name
                }

                bucketName = data.Buckets[i].Name;
            
                s3.listObjects(params, function (err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    if (data) { 
                        console.log("S3 Bucket Objects: " + JSON.stringify(data.Contents.length));
                        // console.log(data.Contents[15]);
                        for (j = 0; j < data.Contents.length; j++) {
                            console.log(data.Contents[j].Key);

                            s3ObjectName = data.Contents[j].Key;

                            var params = {
                                Bucket: bucketName,
                                Key: s3ObjectName
                            }                                                     

                            s3.getObject(params, function (err, objData) {
                                if (err) console.log(err, err.stack); // an error occurred
                                if (objData) {                                    
                                    if (typeof(objData.ServerSideEncryption) === 'undefined') {                                    
                                        console.log("Insecure S3 Bucket Object : " + s3ObjectName)
                                        counter++;
                                    }
                                }
                            });
                        }                    
                    }
                });
            }
            console.log("Total Unencrypted Bucket(s)/Object(s): " + counter);
        }
    });
}
// s3GlobalAcls();
// s3UnencryptedBuckets();