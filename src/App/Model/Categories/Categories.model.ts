import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import slug from 'mongoose-slug-updater';
import { ICategories } from '~/interfaces/ModelDatabase';

const CategoriesSchema: Schema = new Schema(
    {
        code: { type: String, require: true, unique: true },
        name: { type: String, required: true },
        description: { type: String },
        thumbnail: {
            image_url: { type: String },
            public_id: { type: String },
        },
        parent_id: { type: String },
        slug: { type: String, slug: 'name' },
    },
    { timestamps: true },
);

// plugin
CategoriesSchema.plugin(slug);
CategoriesSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});

const Categories = model<ICategories>('Categories', CategoriesSchema);

export default Categories;
