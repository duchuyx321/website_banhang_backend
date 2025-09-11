import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { IShippingPolicies } from '~/interfaces/ModelDatabase';

const ShippingPoliciesSchema: Schema = new Schema(
    {
        provider_id: { type: Schema.Types.ObjectId, required: true },
        region: {
            type: String,
            required: true,
            enum: ['Nội thành', ' Ngoại thành'],
        },
        unit: { type: String, required: true, enum: ['kg'] },
        base_fee: { type: Number }, //phí cơ bản
        base_weight: { type: Number }, //trọng lượng cơ bản nếu hơn thì tính thêm phí
        max_weight: { type: Number }, //giới hạn trọng lượng
        fee_per_unit: { type: Number }, //giá tiền 1 kg thêm
        estimated_days: { type: Number }, //dự kiến thời gian giao
        is_active: { type: Boolean },
    },
    { timestamps: true },
);
// plugin
ShippingPoliciesSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});

const ShippingPolicies = model<IShippingPolicies>(
    'ShippingPolicies',
    ShippingPoliciesSchema,
);

export default ShippingPolicies;
