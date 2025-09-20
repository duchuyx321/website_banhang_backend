import { Application } from 'express';
import adminRoute from '~/Router/admin.route';
import publicRoute from '~/Router/public.route';
import AuthMiddleware from '~/App/Middleware/Auth.middleware';
const routers = (app: Application) => {
    // router user
    // router admin
    app.use(
        '/admin',
        AuthMiddleware.verifyTokenPermission('Admin'),
        adminRoute,
    );
    // router auth
    // router public
    app.use('/', AuthMiddleware.verifyTokenNotRequired, publicRoute);
};

export default routers;
