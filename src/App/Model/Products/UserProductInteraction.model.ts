import { Document, Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';

export interface IUserProductInteraction extends Document {
    user_id: Schema.Types.ObjectId;
    product_id: Schema.Types.ObjectId;
    action: string;
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}

const UserProductInteractionSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', require: true },
        product_id: {
            type: Schema.Types.ObjectId,
            ref: 'Products',
            require: true,
        },
        action: {
            type: String,
            enum: ['view', 'click', 'add_to_cart', 'order', 'wishlist'],
            require: true,
        },
    },
    { timestamps: true, collection: 'userProductInteraction' },
);

// plugin
UserProductInteractionSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});

const UserProductInteraction = model<IUserProductInteraction>(
    'UserProductInteraction',
    UserProductInteractionSchema,
);

export default UserProductInteraction;
