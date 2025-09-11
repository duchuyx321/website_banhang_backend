import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { IOrderItems } from '~/interfaces/ModelDatabase';

const OrderItemsSchema: Schema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, required: true },
        product_id: { type: Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, required: true },
        total: { type: Number, required: true },
    },
    { timestamps: true },
);
// plugin
OrderItemsSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});
const OrderItems = model<IOrderItems>('OrderItems', OrderItemsSchema);

export default OrderItems;
