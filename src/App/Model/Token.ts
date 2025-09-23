import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';

export interface IToken {
    user_id: Schema.Types.ObjectId;
    token: string;
    expiresAt: Date;
}

const TokensSchema: Schema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', require: true },
        token: { type: String, require: true },
        expiresAt: { type: String, require },
    },
    { timestamps: true },
);
// plugin
TokensSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});

export default model<IToken>('Token', TokensSchema);
