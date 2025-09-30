import Categories from '~/App/Model/Categories/Categories.model';
import Products from '~/App/Model/Products/Products.model';

import { RouteHandler } from '~/interfaces/express';
import { IProducts } from '~/interfaces/ModelDatabase';

import { convertXlsxToJson, getValueByType } from '~/Util/XLSX.util';
import { convertStringToJson } from '~/Util/convertTypes.util';
import { deleteFilesCloudinary } from '~/App/Middleware/UploadFileCloudinary.middleware';

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
    //  -- [POST] --/admin/product/add
    addProduct: RouteHandler = async (req, res) => {
        const uploadedImages: string[] = [];
        try {
            const { category_id, name, description, thumbnail, brand } =
                req.body;
            let { mainImage } = req.body;
            mainImage = mainImage ?? 0;
            console.log(thumbnail);
            if (thumbnail && Array.isArray(thumbnail)) {
                type thumbnailItem = IProducts['thumbnail'][0];
                thumbnail.forEach((item: thumbnailItem) => {
                    if (item.public_id) {
                        uploadedImages.push(item.public_id);
                    }
                });
            }
            if (!category_id || !name || !description) {
                if (uploadedImages.length > 0) {
                    await deleteFilesCloudinary(uploadedImages);
                }
                return res
                    .status(403)
                    .json({ error: 'Incomplete upload data!' });
            }
            const isCategory =
                await Categories.findById(category_id).select('_id');
            if (!isCategory) {
                if (uploadedImages.length > 0) {
                    await deleteFilesCloudinary(uploadedImages);
                }
                return res.status(404).json({ error: 'category not found!' });
            }
            const newProduct = new Products({
                category_id,
                name,
                description,
                thumbnail,
                mainImage,
                brand,
            });

            await newProduct.save();
            return res
                .status(200)
                .json({ data: 'update product successfully!' });
        } catch (error) {
            console.log(error);
            if (uploadedImages.length > 0) {
                await deleteFilesCloudinary(uploadedImages);
            }
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
