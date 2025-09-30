import { Router } from 'express';

import AuthController from '~/App/Controller/Auth.controller';
import AuthMiddleware from '~/App/Middleware/Auth.middleware';
import { uploadFileCloudinary } from '~/App/Middleware/UploadFileCloudinary.middleware';
import uploadMemoryFile from '~/App/Middleware/uploadMemoryFile.middleware';

const router = Router();

router.post('/login', AuthController.login);
router.post(
    '/register',
    uploadMemoryFile.single('avatar'),
    uploadFileCloudinary('Avatar'),
    AuthController.register,
);
router.post(
    '/refresh',
    AuthMiddleware.verifyRefreshToken,
    AuthController.refresh,
);
router.post(
    '/logout',
    AuthMiddleware.verifyTokenRequired,
    AuthController.logout,
);
router.post('/forgot-pass', AuthController.forgotPass);
router.post('/otp/email', AuthController.sendMailOTP);
router.post('/reset-pass', AuthController.resetPassword);

export default router;
