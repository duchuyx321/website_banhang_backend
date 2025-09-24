import Products from '~/App/Model/Products/Products.model';
import ProductsAIInsights from '~/App/Model/Products/Products.AIInsights.model';
import ProductsStats from '~/App/Model/Products/Products.Stats.model';
import Categories from '~/App/Model/Categories/Categories.model';
import { IProducts } from '~/interfaces/ModelDatabase';

class ProductService {
    async getProductHot(slug: string, limit: number = 6) {
        try {
            // lấy ra danh mục cần tìm
            const category = await Categories.findOne({ slug }).select('_id');
            if (!category) {
                throw new Error('Category not found!');
            }
            let products = [];
            const product_ids: IProducts['_id'][] = [];
            const productAIHot = await ProductsAIInsights.find()
                .populate({
                    path: 'product_id',
                    match: { category_id: category._id },
                    select: 'name description thumbnail slug',
                })
                .sort({ hot_score: -1 })
                .limit(limit);
            // lấy ra các product hot
            products = productAIHot
                .filter((item) => item.product_id) // loại rỗng do populate không khớp
                .map((item) => {
                    product_ids.push(item.product_id);
                    return item.product_id;
                });
            // nếu chưa đủ hoặc id thiếu
            if (products.length < limit) {
                const statsHot = await ProductsStats.find()
                    .populate({
                        path: 'product_id',
                        match: {
                            category_id: category._id,
                            _id: { $nin: product_ids }, // cho nó nằm ngoài danh sách
                        },
                        select: 'name description thumbnail slug',
                    })
                    .sort({ hot_score: -1 })
                    .limit(limit - products.length);
                products = [
                    ...products,
                    ...statsHot
                        .filter((item) => item.product_id) // loại rỗng do populate không khớp
                        .map((item) => {
                            product_ids.push(item.product_id);
                            return item.product_id;
                        }),
                ];
            }
            // nếu chưa đủ hoặc thiếu
            if (products.length < limit) {
                const prodcutAdd = await Products.find({
                    _id: { $nin: product_ids },
                })
                    .sort({ name: -1 })
                    .limit(limit - products.length);
                products = [...products, ...prodcutAdd];
            }
            return products;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}

export default new ProductService();
