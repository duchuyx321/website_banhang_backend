import express from 'express';

import PublicController from '~/App/Controller/Public.controller';
const router = express.Router();
// [GET]
router.get('/', PublicController.wellcome);
router.get('/home', PublicController.getListHome);

export default router;
