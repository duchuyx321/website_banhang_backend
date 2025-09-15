import { model, Schema } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { ICartItems } from '~/interfaces/ModelDatabase';

const CartItemsSchema: Schema = new Schema(
    {
        cart_id: { type: Schema.Types.ObjectId, required: true },
        user_id: { type: Schema.Types.ObjectId, required: true },
        variant_id: { type: Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true },
        subtotal: { type: Number, required: true },
    },
    { timestamps: true, collection: 'cartItem' },
);
// plugin
CartItemsSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});

const CartItems = model<ICartItems>('CartItems', CartItemsSchema);

export default CartItems;
