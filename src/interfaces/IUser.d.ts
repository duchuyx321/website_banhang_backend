import { Document, Schema } from 'mongoose';

// user mongodb
export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    Username: string;
    Email: string;
    Password: string;
    avatar: {
        Image_url: string | null;
        Public_id: string | null;
    };
    First_name: string;
    Role: string | null;
    Last_name: string;
    IsBlock: boolean | null;
    IsDeleted: boolean | null;
}
