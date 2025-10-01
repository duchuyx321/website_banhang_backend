import {
    dataDecodeJwt,
    methodRequest,
    RouteHandler,
} from '~/interfaces/express';
import CartService from '~/Service/Cart.service';

class CartController {
    // -- [GET] -- /user/cart?page=1&limit=8
    getCartsUser: RouteHandler = async (req: methodRequest, res) => {
        try {
            const { user_id } = req.user as dataDecodeJwt;
            let page = Number.parseInt((req.query.page as string) || '1');
            let limit = Number.parseInt((req.query.limit as string) || '8');
            // Check hợp lệ
            if (isNaN(page) || page < 1) page = 1;
            if (isNaN(limit) || limit < 1 || limit > 20) limit = 8;
            //lấy dữ product in cart
            const dataProductInCart = await CartService.getCartFlowUser(
                user_id,
                page,
                limit,
            );
            return res.status(200).json({ data: dataProductInCart });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    // -- [POST] --/user/cart/add
    addProductToCart: RouteHandler = async (req: methodRequest, res) => {
        try {
            const { user_id } = req.user as dataDecodeJwt;
            const { variant_id } = req.body;
            const quantity = Number.parseInt(
                (req.body.quantity as string) || '1',
            );
            const addToCart = await CartService.addProductToCart(
                variant_id,
                quantity,
                user_id,
            );
            if (addToCart.status !== 200)
                return res
                    .status(addToCart.status)
                    .json({ error: addToCart.message });

            return res
                .status(addToCart.status)
                .json({ data: addToCart.message });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    //  -- [PATCH] --/user/cart/edit
    editQuantityProductToCart: RouteHandler = async (
        req: methodRequest,
        res,
    ) => {
        try {
            const { user_id } = req.user as dataDecodeJwt;
            const { variant_id } = req.body;
            const quantity = Number.parseInt(
                (req.body.quantity as string) || '1',
            );
            const editQuantityProduct =
                await CartService.editQuantityProductToCart(
                    user_id,
                    variant_id,
                    quantity,
                );

            if (editQuantityProduct.status !== 200)
                return res
                    .status(editQuantityProduct.status)
                    .json({ error: editQuantityProduct.message });

            return res
                .status(editQuantityProduct.status)
                .json({ data: editQuantityProduct.message });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    //  -- [DELETE] --/user/cart/delete
    deleteProductToCart: RouteHandler = async (req: methodRequest, res) => {
        try {
            const { user_id } = req.user as dataDecodeJwt;
            const { variant_id } = req.body;
            const deleteProduct = await CartService.deleteProductToCart(
                user_id,
                variant_id,
            );
            if (deleteProduct.status !== 200)
                return res
                    .status(deleteProduct.status)
                    .json({ error: deleteProduct.message });

            return res
                .status(deleteProduct.status)
                .json({ data: deleteProduct.message });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ erorr: (error as Error).message });
        }
    };
}

export default new CartController();
