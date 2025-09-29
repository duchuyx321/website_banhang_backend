import CategoriesStats from '~/App/Model/Categories/Categories.stats.model';
import ProductsStats from '~/App/Model/Products/Products.Stats.model';
import UserProductInteraction from '~/App/Model/Products/UserProductInteraction.model';
import Products from '~/App/Model/Products/Products.model';
import { ICategories, IProducts, IUser } from '~/interfaces/ModelDatabase';
import Variants from '~/App/Model/Products/Variants.model';

const MenuStatistics = {
    view: 'total_views', // lượt xem
    click: 'total_clicks', // click vào detail
    add_to_cart: 'total_add_to_cart', // thêm vào giỏ
    order: 'total_orders', // số đơn hàng
    wishlist: 'total_wishlist', // số lần yêu thích
    return: 'total_returns', // số lần trả hàng (optional)
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ACTION_SCORES = {
    click: 1,
    wishlist: 2,
    add_to_cart: 3,
    purchase: 7,
    review: 4,
    share: 2,
};
class StatisticService {
    //  thêm sản phẩm theo hành động người dùng
    async addProductFlowAction(
        user_id: IUser['_id'] | string,
        product_id: IProducts['id'],
        category_id: ICategories['id'],
        action:
            | 'view'
            | 'click'
            | 'add_to_cart'
            | 'order'
            | 'wishlist'
            | 'return' = 'click',
    ) {
        try {
            const set = {
                [MenuStatistics[action]]: 1,
            };
            // kéo dữ liệu vào trong ai ProductsStats
            await ProductsStats.findOneAndUpdate(
                {
                    product_id,
                },
                { $inc: set },
                { upsert: true, new: true },
            );
            await CategoriesStats.findOneAndUpdate(
                {
                    category_id,
                },
                { $inc: set },
                { upsert: true, new: true },
            );
            if (user_id) {
                await UserProductInteraction.findOneAndUpdate(
                    {
                        product_id,
                        user_id,
                    },
                    { $set: { action } },
                    { upsert: true, new: true },
                );
            }
            return {
                success: true,
                message: 'successful user data statistics!',
            };
        } catch (error) {
            console.log(error);
            throw new Error((error as Error).message);
        }
    }

    //  lấy sản phẩm theo cá nhân hóa người dùng
    async getPersonalizedProducts(
        user_id: string,
        limit: number,
        page: number,
    ) {
        try {
            const skip = (page - 1) * limit;
            //  lấy các product_id sản phẩm theo người dùng
            const statisticsUser = await UserProductInteraction.find({
                user_id,
            })
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('product_id');
            if (!statisticsUser) {
                //  lấy dữ liệu khác của người dùng
                const idProduct = await Products.find()
                    .populate('category_id', 'name')
                    .skip(skip)
                    .limit(limit)
                    .select('');
                const id = idProduct.map((item) => item._id);
                const variants = await Variants.find({
                    isMain: true,
                    product_id: { $nin: id },
                })
                    .populate({
                        path: 'product_id',
                        select: 'name brand category_id thumbnail slug',
                        populate: { path: 'category_id', select: 'name' },
                    })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .select('price SKU variantable_color variantable_size')
                    .lean();
                return variants;
            }
            const product_ids = statisticsUser.map((item) => item.product_id);
            const interactedProducts = await Products.find({
                _id: { $in: product_ids },
            })
                .select('category_id')
                .lean();
            const category_ids = interactedProducts.map(
                (item) => item.category_id,
            );
            const recommendedProducts = await Products.find({
                category_id: { $in: category_ids },
                _id: { $nin: product_ids }, // Loại trừ products đã tương tác
            })
                .sort({ created_at: -1 })
                .limit(limit * 2) // Lấy nhiều để có choice
                .select('')
                .lean();

            const productIds = recommendedProducts.map((p) => p._id);
            const variants = await Variants.find({
                isMain: true,
                product_id: { $nin: productIds },
                category_id: { $in: category_ids },
            })
                .populate({
                    path: 'product_id',
                    select: 'name brand category_id thumbnail slug',
                    populate: { path: 'category_id', select: 'name' },
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('price SKU variantable_color variantable_size')
                .lean();
            return variants;
        } catch (error) {
            console.log(error);
            throw new Error((error as Error).message);
        }
    }
    //  lấy sản phẩm theo lượng thống kê nhiều nhất
    async getPopularProducts() {}
}

export default new StatisticService();
