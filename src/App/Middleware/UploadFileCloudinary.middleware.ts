import cloudinary from '~/Config/Cloudinary/connectCloudinary.config';
import streamifier from 'streamifier';
import { RouteHandler } from '~/interfaces/express';

const uploadFileCloudinary = (folder: string): RouteHandler => {
    return (req, res, next) => {
        if (!req.file) return next();
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) {
                    return next(error);
                }

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
};
const uploadFileMultipleCloudinary = (folder: string): RouteHandler => {
    return (req, res, next) => {
        const files = req.files;

        if (!files || !Array.isArray(files) || files.length === 0) {
            return next();
        }

        const upload = files.map((item) => {
            return new Promise<{
                image_url: string | null;
                public_id: string | null;
            }>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder },
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        resolve({
                            image_url: result?.secure_url || null,
                            public_id: result?.public_id || null,
                        });
                    },
                );
                streamifier.createReadStream(item.buffer).pipe(stream);
            });
        });

        Promise.all(upload)
            .then((result) => {
                req.body.thumbnail = result;
                next();
            })
            .catch(next);
    };
};

const deleteFileCloudinary = async (public_id: string): Promise<void> => {
    await cloudinary.uploader.destroy(public_id);
};

const deleteFileMultipleCloudinary = async (
    public_ids: string[],
): Promise<void> => {
    if (!public_ids.length) return;

    await Promise.all(public_ids.map((id) => cloudinary.uploader.destroy(id)));
};

export {
    uploadFileCloudinary,
    uploadFileMultipleCloudinary,
    deleteFileCloudinary,
    deleteFileMultipleCloudinary,
};
