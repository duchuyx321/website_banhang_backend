import { Router } from 'express';

import adminCategory from '~/Router/Admin/categories.route';
import adminProduct from '~/Router/Admin/product.route';

const router = Router();

router.use('/categories', adminCategory);
router.use('/product', adminProduct);
// router.use('/user');

export default router;
