import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { IInventories } from '~/interfaces/ModelDatabase';

const InventorySchema: Schema = new Schema(
    {
        variant_id: {
            type: Schema.Types.ObjectId,
            ref: 'Variants',
            required: true,
            unique: true,
        },
        stock: { type: Number, required: true },
        sold: { type: Number, required: true },
    },
    { timestamps: true },
);
// plugin
InventorySchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});
const Inventories = model<IInventories>('Inventories', InventorySchema);
export default Inventories;
