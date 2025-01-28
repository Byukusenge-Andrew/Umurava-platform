import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// TODO: For cloud storage (e.g., AWS S3, Google Cloud Storage):
// 1. Replace this local storage setup with cloud storage configuration
// 2. Install relevant SDK (e.g., @aws-sdk/client-s3 or @google-cloud/storage)
// 3. Update storage configuration below

// Create upload directories if they don't exist
const uploadDir = path.join(__dirname, '../../uploads');
const imagesDir = path.join(uploadDir, 'images');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

// For cloud storage, replace this with cloud storage configuration
// Example for AWS S3:
// const storage = multerS3({
//   s3: new S3Client({ region: 'your-region' }),
//   bucket: 'your-bucket-name',
//   key: function(req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imagesDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (type: string) => (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    if (file.mimetype.startsWith(type)) {
        cb(null, true);
    } else {
        cb(new Error(`Please upload a ${type} file`));
    }
};

// For cloud storage, update the storage configuration here
export const uploadImage = multer({ 
    storage: storage,  // This would be replaced with cloud storage config
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});

// For cloud storage, update the storage configuration here
export const uploadVideo = multer({
    storage,  // This would be replaced with cloud storage config
    fileFilter: fileFilter('video/'),
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// TODO: For cloud storage cleanup:
// 1. Add functions to delete files from cloud storage
// 2. Add error handling for cloud storage operations
// 3. Add proper cloud storage URL generation
// Example:
// export async function deleteFromCloud(fileKey: string) {
//   const command = new DeleteObjectCommand({
//     Bucket: 'your-bucket',
//     Key: fileKey,
//   });
//   await s3Client.send(command);
// }
