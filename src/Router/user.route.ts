import { Router } from 'express';

// import route
import meRoute from '~/Router/User/me.route';
import cartRoute from '~/Router/User/cart.route';

const router = Router();

router.use('/me', meRoute);
router.use('/cart', cartRoute);
export default router;
