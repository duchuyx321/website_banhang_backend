import { Application } from 'express';
import admin from '~/Router/admin';
const routers = (app: Application) => {
    // router user
    // router admin
    app.use('/admin', admin);
    // router auth
    // router public
    // app.use('/');
};

export default routers;
