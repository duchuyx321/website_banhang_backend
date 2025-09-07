import { Router } from 'express';

import CategoriesController from '~/App/Controller/Admin/CategoriesController';
import uploadMemoryFile from '~/App/Middleware/uploadMemoryFile';
import { uploadFileCloudinary } from '~/App/Middleware/UploadFileCloudinary';

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
