import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { IUser } from '~/interfaces/ModelDatabase';

const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            maxLength: 20,
            minLength: 8,
        },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: {
            image_url: { type: String },
            public_id: { type: String },
        },
        first_name: { type: String, required: true },
        role: {
            type: String,
            enum: ['User', 'Admin', 'Seller', 'Moderator'],
            default: 'User',
        },
        last_name: { type: String, required: true },
        isBlock: { type: Boolean, default: false },
    },
    { timestamps: true },
);
// plugin
UserSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});

export default model<IUser>('User', UserSchema);
