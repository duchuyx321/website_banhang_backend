import { Router } from 'express';

// import route
import meRoute from '~/Router/User/me.route';

const router = Router();

router.use('/me', meRoute);

export default router;
