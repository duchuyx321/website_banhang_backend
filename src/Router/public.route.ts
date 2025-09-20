import { Router } from 'express';

import PublicController from '~/App/Controller/Public.controller';
const router = Router();
// [GET]
router.get('/home', PublicController.getListHome);
router.get('/:slug', PublicController.getProductDetail);
router.get('/', PublicController.wellcome);

export default router;
