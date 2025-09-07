/* eslint-disable @typescript-eslint/no-unused-vars */
import Categories from '~/App/Model/Categories';

export const getCategoryTree = async () => {
    try {
        const categories = await Categories.find({
            parent_id: null,
        })
            .sort({ name: 1 })
            .select('code name description thumbnail.image_url slug parent_id');
        const data = await Promise.all(
            categories.map(async (item) => {
                const children = await Categories.find({
                    parent_id: item.code,
                })
                    .sort({ name: 1 })
                    .select('name description thumbnail.image_url slug')
                    .lean();
                const { code, parent_id, ...other } = item.toObject();
                return { other, children };
            }),
        );
        return data;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};
