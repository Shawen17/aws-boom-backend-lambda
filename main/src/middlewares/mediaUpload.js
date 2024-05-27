const multer = require("multer");
const S3 = require("aws-sdk/clients/s3");
const dotenv = require("dotenv");
dotenv.config();

const s3 = new S3({
  endpoint: "https://shawenmedia.s3.eu-north-1.amazonaws.com",
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  s3BucketEndpoint: true,
  publicReadAccess: true,
});
let upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1000 * 1024 * 1024,
  },
});
const uploadToS3 = (file) => {
  if (!file) {
    return null;
  } else {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
        Key: `media/avatars/${file.originalname}`,
        Body: file.buffer,
        ContentDisposition: "inline",
        ContentType: file.mimetype,
      };
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }
};
module.exports = { upload, uploadToS3 };
