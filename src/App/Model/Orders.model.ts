import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { IOrders } from '~/interfaces/ModelDatabase';

const OrderSchema: Schema = new Schema(
    {
        User_ID: { type: Schema.Types.ObjectId, required: true },
        Orderable_items: [{ type: Schema.Types.ObjectId, required: true }], //các đơn hàng
        Address_ID: { type: Schema.Types.ObjectId, required: true }, //địa chỉ giao
        PaymentMethod: { type: String, required: true },
        Orderable_status: { type: Schema.Types.ObjectId, required: true }, //trạng thái đơn hàng
        TotalAmount: { type: Number, required: true },
    },
    { timestamps: true },
);
// plugin
OrderSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});

const Orders = model<IOrders>('Orders', OrderSchema);

export default Orders;
