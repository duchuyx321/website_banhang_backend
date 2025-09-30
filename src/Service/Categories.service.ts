import Categories from '~/App/Model/Categories/Categories.model';
import CategoriesAIInsights from '~/App/Model/Categories/Categories.AIInsights.model';
import CategoriesStats from '~/App/Model/Categories/Categories.stats.model';

class CategoriesService {
    // getCategories
    async getCategoriesHot() {
        try {
            const categoryHot = await CategoriesAIInsights.find()
                .sort({
                    hot_score: -1,
                })
                .limit(6)
                .select('category_id')
                .populate(
                    'category_id',
                    'name description thumbnail.image_url slug',
                );
            let categories = categoryHot.map((item) => item.category_id);
            // ai not data
            if (!categories.length) {
                const statsHot = await CategoriesStats.find()
                    .sort({
                        total_orders: -1, // hoặc total_sales, total_views
                    })
                    .limit(6)
                    .select('category_id')
                    .populate(
                        'category_id',
                        'name description thumbnail.image_url slug',
                    );

                categories = statsHot.map((item) => item.category_id);
            }
            // ai not data
            if (!categories.length) {
                categories = await Categories.find()
                    .sort({ createdAt: -1 })
                    .limit(6)
                    .select('name description thumbnail.image_url slug');
            }
            return categories;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}

export default new CategoriesService();
