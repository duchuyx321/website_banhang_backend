import { RouteHandler } from '~/interfaces/express';
import CategoriesService from '~/Service/Categories.service';

import { getCategoryTree } from '~/Util/Categories.util';

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
}

export default new PublicController();
