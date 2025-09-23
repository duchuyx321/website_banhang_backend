import { Router } from 'express';

import ProductController from '~/App/Controller/Admin/Product.controller';
import { uploadFileMultipleCloudinary } from '~/App/Middleware/UploadFileCloudinary.middleware';
import uploadMemoryFile from '~/App/Middleware/uploadMemoryFile.middleware';

const router = Router();

// [GET]
router.get('/', ProductController.getListProducts);
// [POST]
router.post(
    '/add',
    uploadMemoryFile.array('files', 5),
    uploadFileMultipleCloudinary('Products'),
    ProductController.addProduct,
);
router.post(
    '/import/preview',
    uploadMemoryFile.single('file'),
    ProductController.importProductPreview,
);

export default router;
