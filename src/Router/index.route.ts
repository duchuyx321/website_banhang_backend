import { Application } from 'express';
import admin from '~/Router/admin.route';
import publicRoute from '~/Router/public.route';
const routers = (app: Application) => {
    // router user
    // router admin
    app.use('/admin', admin);
    // router auth
    // router public
    app.use('/', publicRoute);
};

export default routers;
