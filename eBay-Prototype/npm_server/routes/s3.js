var AWS = require('aws-sdk');
var config = require('config');

AWS.config.update({
    accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey, region: config.region
});

var s3 = new AWS.S3();

function upload(files, callback){
    var fileUrls = [];
    var uploadedCount = 0;
    Object.keys(files).forEach(function(key) {
        var fileData = files[key];
        var fileName = Date.now()+"_"+fileData.name;
        s3.putObject({
            Bucket: config.bucketName,
            Key: fileName,
            Body: fileData.data,
            ACL: 'public-read',
            ContentType : fileData.mimetype
        }, function (response) {
            fileUrls.push("https://s3-"+config.region+".amazonaws.com/"+config.bucketName+"/"+fileName);
            uploadedCount++;
        });
    });
    var interval = setInterval(function(){
        if(uploadedCount === Object.keys(files).length) {
            clearInterval(interval);
            callback(null,fileUrls);
        }
    },500);
}

exports.upload = upload;