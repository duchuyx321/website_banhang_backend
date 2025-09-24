import CategoriesStats from '~/App/Model/Categories/Categories.stats.model';
import ProductsStats from '~/App/Model/Products/Products.Stats.model';
import UserProductInteraction from '~/App/Model/Products/UserProductInteraction.model';
import { ICategories, IProducts, IUser } from '~/interfaces/ModelDatabase';

class StatisticSerive {
    async addProductFlowActionCLick(
        user_id: IUser['_id'],
        product_id: IProducts['id'],
        category_id: ICategories['id'],
    ) {
        try {
            // kéo dữ liệu vào trong ai ProductsStats
            await ProductsStats.findOneAndUpdate(
                {
                    product_id,
                },
                { $set: { total_clicks: { $inc: 1 } } },
                { upsert: true, new: true },
            );
            await CategoriesStats.findOneAndUpdate(
                {
                    category_id,
                },
                { $set: { total_clicks: { $inc: 1 } } },
                { upsert: true, new: true },
            );
            if (user_id) {
                await UserProductInteraction.findByIdAndUpdate(
                    {
                        product_id,
                        user_id,
                    },
                    { $set: { action: 'click' } },
                    { upsert: true, new: true },
                );
            }
        } catch (error) {
            console.log(error);
            throw new Error((error as Error).message);
        }
    }
}

export default new StatisticSerive();
