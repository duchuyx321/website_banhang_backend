import { RouteHandler } from '~/interfaces/express';
import Categories from '~/App/Model/Categories';
import { convertXlsxToJson } from '~/Util/XLSXUtil';
import { getCategoryTree } from '~/Util/CategoriesUtil';

class CategoriesController {
    // [GET] --/categories/
    getListCategories: RouteHandler = async (req, res) => {
        try {
            const data = await getCategoryTree();
            return res.status(200).json({ data: data });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    // [POST] --/categories/add
    addCategories: RouteHandler = async (req, res) => {
        try {
            const { code, name, description, parent_id } = req.body;
            if (!code || !name || !description || !parent_id) {
                return res
                    .status(403)
                    .json({ error: 'Incomplete upload data' });
            }
            const newCategories = new Categories({
                code,
                name,
                description,
                parent_id,
            });
            await newCategories.save();
            return res.status(200).json({
                data: {
                    message: 'add categories successful',
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    // [POST] --/categories/import/preview
    importCategoriesPreview: RouteHandler = async (req, res) => {
        try {
            const file = req.file;
            if (!file)
                return res.status(404).json({ error: 'No files uploaded' });
            const rawData = convertXlsxToJson(file.buffer) as Record<
                string,
                unknown
            >[];
            const dataImport = rawData.map((item) => {
                const code =
                    typeof item['code'] === 'string' ? item['code'] : null;
                const name =
                    typeof item['name'] === 'string' ? item['name'] : null;
                const description =
                    typeof item['description'] === 'string'
                        ? item['description']
                        : null;
                const image_url =
                    typeof item['image_url'] === 'string'
                        ? item['image_url']
                        : null;
                const public_id =
                    typeof item['public_id'] === 'string'
                        ? item['public_id']
                        : null;
                const thumbnail = { image_url, public_id };
                const parent_id =
                    typeof item['parent_id'] === 'string'
                        ? item['parent_id']
                        : null;

                return { code, name, description, thumbnail, parent_id };
            });
            await Categories.insertMany(dataImport);
            return res.status(200).json({
                data: { message: 'import suceessfull!' },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
}
export default new CategoriesController();
