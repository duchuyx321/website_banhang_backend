import express from 'express';

import PublicController from '~/App/Controller/PublicController';
const router = express.Router();
// [GET]
router.get('/', PublicController.wellcome);
router.get('/home', PublicController.getListHome);

export default router;
