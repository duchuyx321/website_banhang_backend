import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

// mã hóa mật khẩu
export const hashPass = async (password: string) => {
    const saltRounds = Number(process.env.SALT_ROUNDS);
    return bcryptjs.hash(password, saltRounds);
};

//  giải mã mật khẩu
export const comparePassword = async (password: string, passHash: string) => {
    return bcryptjs.compare(password, passHash);
};
