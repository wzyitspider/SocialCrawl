var AWS = require("aws-sdk");
AWS.config.loadFromPath('../config.json');

var fs = require('fs');
var path = require('path');
s3 = new AWS.S3();
const superagent = require("superagent");


async function uploadBase6432S3(base64,name) {
    var uploadParams = { Bucket: "cocofinder-social-info", Key: '', Body: '' ,ACL:"public-read" };
    // var uploadParams = { Bucket: "cocofinder-social-info", Key: '', Body: ''  };
    var dataBuffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    uploadParams.Body = dataBuffer;
    uploadParams.Key = "headimg/"+name
    // call S3 to retrieve upload file to specified bucket
    return new Promise((resolve,reject)=>{
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                reject(err)
            } if (data) {
                resolve( data.Location)
            }
        });
    })
}

async function uploadFile2S3(file) {
    var uploadParams = { Bucket: "cocofinder-social-info", Key: '', Body: '' ,ACL:"public-read" };
    var fileStream = fs.createReadStream(file);
    uploadParams.Body = fileStream;
    uploadParams.Key = path.basename(file);
    // call S3 to retrieve upload file to specified bucket
    return new Promise((resolve,reject)=>{
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                reject(err)
            } if (data) {
                resolve( data.Location)
            }
        });
    })
}

async function uploadUrl2S3(url,name) {
    var uploadParams = { Bucket: "cocofinder-social-info", Key: '', Body: '' ,ACL:"public-read" };
   // var uploadParams = { Bucket: "cocofinder-social-info", Key: '', Body: ''  };
    uploadParams.Body = await url2Data(url);
    uploadParams.Key = "headimg/"+name
    // call S3 to retrieve upload file to specified bucket
    return new Promise((resolve,reject)=>{
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                reject(err)
            } if (data) {
                resolve( data.Location)
            }
        });
    })
}

 async function url2Data(url) {
    return await new Promise(async function (resolve, reject) {
        await superagent.get(url).buffer(true).parse((res) => {
            let buffer = [];
            res.on('data', (chunk) => {
                buffer.push(chunk);
            });
            res.on('end', () => {
                const data = Buffer.concat(buffer);
                //const base64Img = data.toString('base64');
                resolve(data)
            });
        });
    })
}

module.exports = {uploadBase6432S3 ,uploadUrl2S3 , uploadFile2S3}


