import { RouteHandler } from '~/interfaces/express';
import Categories from '~/App/Model/Categories/Categories.model';
import { convertXlsxToJson, getValueByType } from '~/Util/XLSX.util';
import { getCategoryTree } from '~/Util/Categories.util';

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
                const image_url = getValueByType(item, 'image_url', 'string');
                const public_id = getValueByType(item, 'public_id', 'string');
                const thumbnail = { image_url, public_id };
                return {
                    code: getValueByType(item, 'code', 'string'),
                    name: getValueByType(item, 'name', 'string'),
                    description: getValueByType(item, 'description', 'string'),
                    thumbnail,
                    parent_id: getValueByType(item, 'parent_id', 'string'),
                };
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
