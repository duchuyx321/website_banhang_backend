import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import slug from 'mongoose-slug-updater';
import { IProducts } from '~/interfaces/ModelDatabase';

const ProductsSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        mainImage: { type: Number, default: 0 },
        thumbnail: [
            {
                image_url: { type: String },
                public_id: { type: String },
            },
        ],
        isdeleted: { type: Boolean },
        brand: { type: String, required: true },
        category_id: {
            type: Schema.Types.ObjectId,
            ref: 'Categories',
            required: true,
        },
        slug: { type: String, slug: 'name' },
    },
    { timestamps: true },
);

// plugins
ProductsSchema.plugin(slug);
ProductsSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});
export default model<IProducts>('Products', ProductsSchema);
