import { Router } from 'express';

import MeController from '~/App/Controller/User/Me.controller';

const router = Router();

// post
router.get('/', MeController.getProfileMe);
// post
router.post('/email/send', MeController.sendMailMe);
// patch
router.patch('/', MeController.editMeProfile);
router.patch('/email', MeController.verifyOTP, MeController.changeEmail);
router.patch('/password', MeController.verifyOTP, MeController.changePassword);

export default router;
