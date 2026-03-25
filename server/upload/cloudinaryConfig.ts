import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import config from '../config';

cloudinary.config({
    cloud_name: config.cloudName, 
    api_key: config.apiKey,
    api_secret: config.apiSecret,
});

const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'teacher', 
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    } as any,
});

const fileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'files',
        resource_type: 'raw', 
    } as any,
});

export const uploadImg = multer({ storage: imageStorage });
export const uploadFile = multer({ storage: fileStorage });