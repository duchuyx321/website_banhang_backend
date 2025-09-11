import { model, Schema } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { ICarts } from '~/interfaces/ModelDatabase';

const CartsSchema: Schema = new Schema(
    {
        cartable_items: [{ type: Schema.Types.ObjectId }],
        user_id: { type: Schema.Types.ObjectId, required: true, unique: true },
        totalquantity: { type: Number },
        totalprice: { type: Number },
    },
    { timestamps: true },
);

// plugin
CartsSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});

const Carts = model<ICarts>('Carts', CartsSchema);

export default Carts;
