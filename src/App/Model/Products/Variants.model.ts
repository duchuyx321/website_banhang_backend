import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { IVariants } from '~/interfaces/ModelDatabase';

const VariantSchema: Schema = new Schema(
    {
        variantable_color: { type: String, required: true },
        variantable_size: { type: String, required: true },
        price: { type: Number, required: true },
        product_id: {
            type: Schema.Types.ObjectId,
            ref: 'Products',
            required: true,
        },
        SKU: { type: String, required: true, unique: true },
        variantable_weight: { type: String, required: true },
        variantable_unit: { type: String, required: true, enum: ['kg'] },
    },
    { timestamps: true },
);
// plugin
VariantSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});

const Variants = model<IVariants>('Variants', VariantSchema);

export default Variants;
