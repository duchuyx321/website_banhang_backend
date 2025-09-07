import cloudinary from '~/Config/Cloudinary/connectCloudinary';
import streamifier from 'streamifier';
import { RouteHandler } from '~/interfaces/express';

const uploadFileCloudinary: RouteHandler = (req, res, next) => {
    if (!req.file) return next();
    const stream = cloudinary.uploader.upload_stream(
        { folder: 'Categories' },
        (error, result) => {
            if (error) return next(error);

            // add result body
            req.body.thumbnail = {
                image_url: result?.secure_url || null,
                public_id: result?.public_id || null,
            };
            next();
        },
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
};

const deleteFileCloudinary = async (public_id: string): Promise<void> => {
    await cloudinary.uploader.destroy(public_id);
};

export { uploadFileCloudinary, deleteFileCloudinary };
