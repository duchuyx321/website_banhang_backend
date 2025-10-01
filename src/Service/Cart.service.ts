import CartItems from '~/App/Model/Cart/CartItems.model';
import Carts from '~/App/Model/Cart/Carts.model';
import Variants from '~/App/Model/Products/Variants.model';

class CartService {
    // get cart flow user
    async getCartFlowUser(user_id: string, page: number, limit: number = 8) {
        try {
            const skip = (page - 1) * limit;
            const cartsUser = await Carts.findOne({ user_id })
                .select('cartable_items totalquantity totalprice')
                .lean();
            if (!cartsUser) {
                return {
                    data: {
                        totalquantity: 0,
                        totalprice: 0,
                    },
                    nextPage: false,
                };
            }
            //  select cart items
            const cartItems = cartsUser?.cartable_items;
            const cartItemsUser = await CartItems.find({
                _id: { $in: cartItems },
                cart_id: cartsUser?._id,
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('variant_id quantity subtotal')
                .lean();
            // lấy ra sản phẩm
            const variant_ids = cartItemsUser.map((item) => item.variant_id);
            const productsInCart = await Variants.find({
                _id: { $in: variant_ids },
            })
                .select(
                    'variantable_color variantable_size price product_id SKU ',
                )
                .populate(
                    'category_id',
                    'name description thumbnail.image_url slug',
                )
                .lean();
            const cartItemMap = new Map(
                cartItemsUser.map((ci) => [ci.variant_id, ci]),
            );
            const dataProductInCart = productsInCart.map((item) => {
                const totalCartItem = cartItemMap.get(item._id);
                return {
                    ...item,
                    quantity: totalCartItem?.quantity,
                    subtotal: totalCartItem?.subtotal,
                };
            });
            return {
                data: {
                    dataProductInCart,
                    totalquantity: cartsUser?.totalquantity,
                    totalprice: cartsUser?.totalprice,
                },
                nextPage:
                    (cartsUser?.totalquantity as number) - page * limit > 0,
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
    // add product to cart
    async addProductToCart(
        variant_id: string,
        quantity: number = 1,
        user_id: string,
    ) {
        try {
            // kiểm tra variants có tồn tại hay không
            const variant = await Variants.findById(variant_id).select('price');
            if (!variant)
                return {
                    status: 404,
                    message: 'There is no product type for this product!',
                };

            const subtotal = variant.price * quantity;
            //  lấy ra cart của user
            const cartUser = await Carts.findOneAndUpdate(
                { user_id },
                { $setOnInsert: { user_id } },
                { new: true, upsert: true },
            ).select('');
            //  tìm kiếm sản phẩm đã tồn tại chưa
            const cartItem = await CartItems.findOne({ variant_id }).select('');
            if (!cartItem)
                return {
                    status: 409,
                    message: 'This product already exists in the cart!',
                };

            const newCartItem = new CartItems({
                cart_id: cartUser._id,
                user_id,
                variant_id,
                quantity,
                subtotal,
            });
            await newCartItem.save();
            // lưu sản phẩm vào trong cart
            const updateCartItem = await Carts.updateOne(
                { user_id },
                {
                    $push: { cartable_items: newCartItem._id },
                    $inc: { totalquantity: 1, totalprice: subtotal },
                },
            );
            if (updateCartItem.modifiedCount === 0)
                return {
                    status: 503,
                    message: 'add product to cart is faild!',
                };
            return {
                status: 200,
                message: 'add product to cart is successful!',
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
    // edit quantity to cart
    async editQuantityProductToCart(
        user_id: string,
        variant_id: string,
        quantity: number = 1,
    ) {
        try {
            //  check xem variant có tồn tại
            const vanriant =
                await Variants.findById(variant_id).select('price');
            if (!vanriant)
                return { status: 404, message: 'product does not exist!' };
            const subtotal = vanriant.price * quantity;
            // kiểm tra xem đã tồn tại trong giỏ hàng hay không
            const checkCartItem = await CartItems.findOne({
                variant_id,
                user_id,
            }).select('quantity subtotal');
            if (!checkCartItem)
                return {
                    status: 404,
                    message: 'product does not exist in the cart!',
                };
            if (
                checkCartItem.quantity === quantity ||
                checkCartItem.subtotal === subtotal
            )
                return {
                    status: 409,
                    message: 'The data in the shopping cart remains unchanged!',
                };
            // chỉnh sửa lại cart tổng tiền
            const totalpriceProduct = subtotal - checkCartItem.subtotal;
            const updateCartItem = await CartItems.updateOne(
                {
                    user_id,
                    variant_id,
                },
                { $set: { subtotal, quantity } },
            );
            // chỉnh sửa lại tổng số tiền trong cart chính
            const editTotalCart = await Carts.updateOne(
                { user_id },
                { $inc: { totalprice: totalpriceProduct } },
            );

            if (
                updateCartItem.modifiedCount === 0 ||
                editTotalCart.modifiedCount === 0
            )
                return {
                    status: 503,
                    message: 'change the number of faild!',
                };
            return {
                status: 200,
                message: 'change the number of successful!',
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
    // delete product to cart
    async deleteProductToCart(user_id: string, variant_id: string) {
        try {
            //  kiểm tra sản phẩm có tồn tại trong giỏ hàng
            const checkProductToCart = await CartItems.findOne({
                user_id,
                variant_id,
            }).select('cart_id subtotal');
            if (!checkProductToCart)
                return {
                    status: 404,
                    message: 'product does not exist in the cart!',
                };

            //  thay đổi tổng số tiền
            const subtotal = checkProductToCart.subtotal;
            const editTotalCart = await Carts.updateOne(
                {
                    _id: checkProductToCart.cart_id,
                    user_id,
                },
                {
                    $pull: { cartable_items: checkProductToCart._id },
                    $inc: {
                        totalprice: -subtotal,
                        totalquantity: -1,
                    },
                },
            );
            if (editTotalCart.modifiedCount === 0)
                return { status: 503, message: 'product deleted failed!' };
            await CartItems.deleteOne({
                _id: checkProductToCart._id,
                user_id,
                variant_id,
            });
            return { status: 503, message: 'Product deleted successfully!' };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}
export default new CartService();
