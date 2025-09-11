import { model, Schema } from 'mongoose';
import MongooseDelete from 'mongoose-delete';

import { IAddress } from '~/interfaces/ModelDatabase';

const AddressSchema: Schema = new Schema(
    {
        phone: { type: String, required: true },
        addressable_line: {
            type: String,
            required: true,
        }, //địa chỉ chi tiết
        addressable_ward: { type: String, required: true }, // phường/xã
        addressable_city: {
            type: String,
            required: true,
        }, //Tĩnh/ thành phố
        country: { type: String, required: true, enum: ['quốc gia'] },
        addressable_district: {
            type: String,
            required: true,
        }, // quận/huyên
        fullname: { type: String, required: true },
    },
    { timestamps: true },
);
// plugin
AddressSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});

const Address = model<IAddress>('Address', AddressSchema);

export default Address;
