const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const AWS = require('aws-sdk');
const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-north-1'
})
const S3 = new AWS.S3();
module.exports = {
    getFileFromS3: () => {

      return new Promise( (resolve,reject) => {
  
        try {
          const bucketName ='salamonradiosongsbucket';
          const objectKey = '01. STARGAZING.mp3';
          S3.getObject({
            Bucket : bucketName,
            Key: objectKey
          }, (err,data) => {
            if (err){
              reject(err);
            }else {
              console.log("unparsed data", data);
              resolve(data);
            }
  
          })
        } catch(e){
          reject(e);
        }
      })
    }
  }
  