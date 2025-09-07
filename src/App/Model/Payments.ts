import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { IPayments } from '~/interfaces/ModelDatabase';

const PaymentsSchema: Schema = new Schema(
    {
        order_id: { type: Schema.Types.ObjectId, required: true, unique: true },
        user_id: { type: Schema.Types.ObjectId, required: true },
        amount: { type: String, required: true },
        status: {
            type: String,
            required: true,
            enum: ['pending ', ' success ', ' failed ', ' refunded'],
        },
        currency: { type: String, required: true, enum: ['VNĐ', ' USD'] },
        method: {
            type: String,
            required: true,
            enum: ['COD', ' VNPay', ' MoMo', ' Paypal'],
        },
        transactionid: { type: String, required: true },
    },
    { timestamps: true },
);
// plugin
PaymentsSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});

const Payments = model<IPayments>('Payments', PaymentsSchema);

export default Payments;
