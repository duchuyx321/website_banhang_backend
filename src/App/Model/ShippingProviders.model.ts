import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { IShippingProviders } from '~/interfaces/ModelDatabase';

const ShippingProviderSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        order_id: { type: Schema.Types.ObjectId, required: true, unique: true },
        code: { type: String, required: true, unique: true },
        hotline: { type: String, required: true },
        website: { type: String, required: true },
        is_active: { type: String, required: true },
        avatar: {
            image_url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
    },
    { timestamps: true },
);
// plugin
ShippingProviderSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});
const ShippingProviders = model<IShippingProviders>(
    'ShippingProviders',
    ShippingProviderSchema,
);

export default ShippingProviders;
