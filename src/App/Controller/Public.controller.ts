import {
    dataDecodeJwt,
    methodRequest,
    RouteHandler,
} from '~/interfaces/express';
import CategoriesService from '~/Service/Categories.service';
import ProductsService from '~/Service/Products.service';

import { getCategoryTree } from '~/Util/Categories.util';
import ProductsModel from '~/App/Model/Products/Products.model';
import Categories from '~/App/Model/Categories/Categories.model';
import { IProducts } from '~/interfaces/ModelDatabase';
import StatisticService from '~/Service/Statistic.service';

class PublicController {
    // --[GET]--/
    wellcome: RouteHandler = async (req, res) => {
        return res.send('Hello World! đang test dự án nè');
    };

    // [GET] --/home?include=banner,category,promotion&productSet=dien-thoai-di-dong,laptop
    getListHome: RouteHandler = async (req, res) => {
        try {
            const { include, productSet } = req.query;
            const result: Record<string, unknown> = {};
            if (include) {
                const partInclude = (include as string).split(',');
                for (const item of partInclude) {
                    if (item === 'bannner') {
                        // lấy dữ liệu banner có thể sau này thêm vào
                    }
                    if (item === 'category') {
                        // lấy dữ liệu category
                        result['category'] =
                            await CategoriesService.getCategoriesHot();
                    }
                    if (item === 'promotion') {
                        // lấy dữ liệu khuyến mãi có thể thêm sau này
                    }
                }
            }
            if (productSet) {
                const partProductSet = (productSet as string).split(',');
                for (const slug of partProductSet) {
                    if (!slug) continue;
                    //  lấy dữ liệu product lấy các dữ liệu hot của product
                    const productHot =
                        await ProductsService.getProductHot(slug);

                    result[slug] = productHot;
                }
            }
            return res.status(200).json({ data: result });
        } catch (error) {
            const err = error as Error;
            console.log(err);
            return res.status(500).json({ error: err.message });
        }
    };
    // --[GET] --/categories
    getListCategories: RouteHandler = async (req, res) => {
        try {
            const data = await getCategoryTree();
            return res.status(200).json({ data });
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    // -- [GET] -- /products?page=1&limit=8
    getListProductsFlowPage: RouteHandler = async (req: methodRequest, res) => {
        try {
            const user = req.user as dataDecodeJwt;
            const page = Number.parseInt((req.body.page as string) || '1');
            const limit = Number.parseInt((req.body.limit as string) || '12');
            // nêu người dùng đã đăng nhập
            // if (user) {
            // }
            //  lấy dữ liệu theo người dùng
            const products = await StatisticService.getPersonalizedProducts(
                user.user_id,
                limit,
                page,
            );
            return res.status(200).json({ data: products });
            // lấy dữ liệu theo thống kê lượng sản phẩm thổng quát
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    // -- [GET] -- /:slug
    getProductDetail: RouteHandler = async (req: methodRequest, res) => {
        try {
            const user = req.user as dataDecodeJwt;
            const { slug } = req.params;

            // lấy thông tin sản phẩm
            const product: IProducts = await ProductsModel.findOne({
                slug,
            }).select(
                'category_id name description mainImage thumbnail brand slug',
            );
            if (!product) {
                return res.status(404).json({ error: 'product not found!' });
            }
            //  thống kê sản phẩm theo AI mình cần thống kê
            await StatisticService.addProductFlowAction(
                user.user_id || '',
                product._id,
                product.category_id,
                'click',
            );
            //  lấy category
            const category = await Categories.findById(
                product.category_id,
            ).select('code name description thumbnail slug');
            const data = { product, category };
            return res.status(200).json({ data: data });
            return;
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    };
}

export default new PublicController();
