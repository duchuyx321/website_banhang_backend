import { Application } from 'express';

// route
import adminRoute from '~/Router/admin.route';
import publicRoute from '~/Router/public.route';
import authRoute from '~/Router/auth.route';
import userRoute from '~/Router/user.route';

// middleware
import AuthMiddleware from '~/App/Middleware/Auth.middleware';
const routers = (app: Application) => {
    // router user
    app.use('/user', AuthMiddleware.verifyTokenRequired, userRoute);
    // router admin
    app.use(
        '/admin',
        AuthMiddleware.verifyTokenPermission('Admin'),
        adminRoute,
    );
    // router auth
    app.use('/auth', authRoute);
    // router public
    app.use('/', AuthMiddleware.verifyTokenNotRequired, publicRoute);
};

export default routers;
