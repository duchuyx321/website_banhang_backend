import Joi from 'joi';
import { IUser } from '~/interfaces/ModelDatabase';
const registerSchema = Joi.object({
    username: Joi.string().min(6).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    thumbnail: Joi.object({
        image_url: Joi.string().uri().required(),
        public_id: Joi.string().required(),
    })
        .optional()
        .allow(null), // cho phép bỏ trống
    first_name: Joi.string().min(3).max(20).required(),
    last_name: Joi.string().min(3).max(20).required(),
    OTP: Joi.string().length(6).allow(null),
});
export const validateRegister = (data: IUser) => {
    return registerSchema.validate(data, { abortEarly: false });
};
interface IData {
    username?: string;
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    thumbnail?: {
        image_url?: string;
        public_id?: string;
    };
    OTP?: string;
}
const dataCheck = Joi.object({
    username: Joi.string().min(6).max(20),
    email: Joi.string().email(),
    password: Joi.string().min(8),
    thumbnail: Joi.object({
        image_url: Joi.string().uri(),
        public_id: Joi.string(),
    })
        .optional()
        .allow(null), // cho phép bỏ trống
    first_name: Joi.string().min(3).max(20),
    last_name: Joi.string().min(3).max(20),
    OTP: Joi.string().length(6).allow(null),
});
export const validateValue = (data: IData) => {
    return dataCheck.validate(data, { abortEarly: false });
};
