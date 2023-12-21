const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')
const AWS = require('aws-sdk')
// const s3Client = new S3Client({
//     region: 'eu-north-1',
//     credentials: {
//       accessKeyId: process.env.AWS_ACCESS_KEY,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     },
// });
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'eu-north-1'
})

const S3 = new AWS.S3()

module.exports = {
  getFileFromS3: (bucketName, objectKey) => {
    console.log('bucket', bucketName, ' key ', objectKey)
    return new Promise((resolve, reject) => {
      try {
        S3.getObject(
          {
            Bucket: bucketName,
            Key: objectKey
          },
          (err, data) => {
            if (err) {
              reject(err)
            } else {
              // console.log('unparsed data', data)
              // console.log("data body", data.Body);
              resolve(data)
            }
          }
        )
      } catch (e) {
        reject(e)
      }
    })
  }
}

const client = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})
// module.exports = {
//   getFileFromS3 : async (bucketName, objectKey) => {
//     const command = new GetObjectCommand({
//       Bucket: bucketName,
//       Key: objectKey,
//     });
//     console.log('bucket', bucketName, ' key ', objectKey)
//     try {
//       console.log("send command ")
//       const response = await client.send(command);
//       // console.log("got response  ", response.Body)
//       // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
//       const str = await response.Body.transformToByteArray();
//       // const str_call = await str.call();
//       // const str_app = await response.Body.transformToString.apply();
//       // console.log("str:",str);
//       return str;
//       // console.log("str call :",str_call);
//       // console.log("str call :",str_call);
//     } catch (err) {
//       console.error(err);
//     }
//   }
// }
