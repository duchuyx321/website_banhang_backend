import Joi from 'joi';
import { IUser } from '~/interfaces/ModelDatabase';
const registerSchema = Joi.object({
    username: Joi.string().min(6).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    avatar: Joi.object({
        image_url: Joi.string().uri().required(),
        public_id: Joi.string().required(),
    })
        .optional()
        .allow(null), // cho phép bỏ trống
    first_name: Joi.string().min(8).max(20).required(),
    last_name: Joi.string().min(8).max(20).required(),
});
export const validateRegister = (data: IUser) => {
    return registerSchema.validate(data, { abortEarly: false });
};
