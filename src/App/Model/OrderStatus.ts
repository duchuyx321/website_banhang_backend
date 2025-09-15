import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { IOrderStatus } from '~/interfaces/ModelDatabase';

const OrderStatusSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
            enum: [
                'pending',
                'confirmed',
                'shipping',
                'delivered',
                'cancelled',
                'delivered',
                'received',
            ],
        },
        name: {
            type: String,
            required: true,
            enum: [
                'đang chờ xử lý',
                'đã xác nhận',
                'đang vận chuyển',
                'đã giao',
                'đã hủy',
                'đã giao',
                'đã nhận',
            ],
        },
        description: {
            type: String,
            required: true,
        }, //nên tạo một bộ mô tả danh riêng cho các trạng thái đơn hàng
    },
    { timestamps: true },
);
// plugin
OrderStatusSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});
const OrderStatus = model<IOrderStatus>('OrderStatus', OrderStatusSchema);

export default OrderStatus;
