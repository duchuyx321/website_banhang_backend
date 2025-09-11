import { Router } from 'express';

import ProductController from '~/App/Controller/Admin/Product.controller';
import uploadMemoryFile from '~/App/Middleware/uploadMemoryFile.middleware';

const router = Router();

// [GET]
router.get('/', ProductController.getListProducts);
// [POST]
router.post(
    '/import/preview',
    uploadMemoryFile.single('file'),
    ProductController.importProductPreview,
);

export default router;
