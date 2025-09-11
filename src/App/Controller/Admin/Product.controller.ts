import { RouteHandler } from '~/interfaces/express';
import Products from '~/App/Model/Products.model';
import { convertXlsxToJson, getValueByType } from '~/Util/XLSX.util';
import { convertStringToJson } from '~/Util/convertTypes.util';

class ProductController {
    // [GET] --/admin/product?page=1&limit=10
    getListProducts: RouteHandler = async (req, res) => {
        try {
            const pageRaw = req.query.page;
            const limitRaw = req.query.limit;

            const page = typeof pageRaw === 'string' ? parseInt(pageRaw) : 1;
            const limit =
                typeof limitRaw === 'string' ? parseInt(limitRaw) : 10;

            const skip = (page - 1) * limit;
            const products = await Products.find({})
                .sort({ createAt: -1 })
                .skip(skip)
                .limit(limit);
            const hasMore = products.length === limit;
            return res.status(200).json({ data: { products, hasMore } });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    //  -- [POST] --/admin/product/
    addProduct: RouteHandler = async (req, res) => {
        try {
            // const {} = req.body;
            return res.status(200).json({ data: '' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    //  -- [POST] --/amdin/import/preview
    importProductPreview: RouteHandler = async (req, res) => {
        try {
            const file = req.file;
            if (!file)
                return res.status(404).json({ error: 'not file upload!' });

            // read data file
            const readDataImport = convertXlsxToJson(file.buffer) as Record<
                string,
                unknown
            >[];
            const dataImport = readDataImport.map((item) => {
                type thumbnailProduct = {
                    image_url: string;
                    public_id: string;
                };
                const thumbnailImport = getValueByType(
                    item,
                    'thumbnail',
                    'string',
                );
                const thumbnailConvertType = convertStringToJson<
                    thumbnailProduct[]
                >(thumbnailImport as string);

                return {
                    category_id: getValueByType(item, 'category_id', 'string'),
                    name: getValueByType(item, 'name', 'string'),
                    description: getValueByType(item, 'description', 'string'),
                    thumbnail: thumbnailConvertType,
                    brand: getValueByType(item, 'description', 'string'),
                };
            });

            //  thêm vào data base
            Products.insertMany(dataImport);
            return res.status(200).json({ date: 'import successfull' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
}

export default new ProductController();
