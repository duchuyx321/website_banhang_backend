import { Application } from 'express';
<<<<<<< Updated upstream:src/Router/index.ts
=======
import admin from '~/Router/admin.route';
import publicRoute from '~/Router/public.route';
>>>>>>> Stashed changes:src/Router/index.route.ts
const routers = (app: Application) => {
    // router user
    // router admin
    // router auth
    // router public
<<<<<<< Updated upstream:src/Router/index.ts
    app.use('/');
=======
    app.use('/', publicRoute);
>>>>>>> Stashed changes:src/Router/index.route.ts
};

export default routers;
