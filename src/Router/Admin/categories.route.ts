import { Router } from 'express';

import CategoriesController from '~/App/Controller/Admin/Categories.controller';
import uploadMemoryFile from '~/App/Middleware/uploadMemoryFile.middleware';
import { uploadFileCloudinary } from '~/App/Middleware/UploadFileCloudinary.middleware';

const router = Router();

// [GET]
router.get('/', CategoriesController.getListCategories);

// [POST]
router.post(
    '/add',
    uploadMemoryFile.single('thumbnail'),
    uploadFileCloudinary,
    CategoriesController.addCategories,
);
router.post(
    '/import/preview',
    uploadMemoryFile.single('file'),
    CategoriesController.importCategoriesPreview,
);
// router.post('/import/confirm', CategoriesController);

export default router;
