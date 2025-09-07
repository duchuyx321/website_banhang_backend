import { Router } from 'express';

import categories from '~/Router/Admin/categories';
// import product from '~/Router/Admin/product';
// import user from '~/Router/Admin/user';

const router = Router();

router.use('/categories', categories);
// router.use('/product', product);
// router.use('/user', user);

export default router;
