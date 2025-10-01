import { Router } from 'express';

import CartController from '~/App/Controller/User/Cart.controller';

const router = Router();
// --- /user/cart ---

//  [GET]
router.get('/', CartController.getCartsUser);
// [POST]
router.post('/add', CartController.addProductToCart);
// [PATCH]
router.patch('/edit', CartController.editQuantityProductToCart);
// [DELETE]
router.delete('/delete', CartController.deleteProductToCart);
export default router;
