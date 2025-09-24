import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
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

// Chữ thường
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
// Chữ hoa
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// Số
const numbers = '0123456789';
// Ký tự đặc biệt
const specials = "!@#$%^&*()_+-=[]{}|;:',.<>?/`~";
const generateRandomString = (length: number, rangeChoices: string): string => {
    let randomString: string = '';
    for (let i = 0; i < length; i++) {
        const randomNumber = crypto.randomInt(0, rangeChoices.length);
        randomString += rangeChoices[randomNumber];
    }
    return randomString;
};
// create OTP
export const createOTP = async (
    length: number,
    mode: 'upper' | 'lower' | 'mixed' = 'upper',
) => {
    let rangeChoices = lowercase + numbers;
    if (mode === 'mixed') {
        rangeChoices = uppercase + rangeChoices;
    }
    const otp = generateRandomString(length, rangeChoices);
    if (mode === 'upper') return otp.toLocaleUpperCase();
    return otp;
};

export const resetPass = async (length: number = 8) => {
    const charSpecial = specials[crypto.randomInt(0, specials.length)];
    const charNumber = numbers[crypto.randomInt(0, numbers.length)];
    const charLower = lowercase[crypto.randomInt(0, lowercase.length)];
    const charUplower = uppercase[crypto.randomInt(0, uppercase.length)];
    const rangeChoices = uppercase + lowercase + numbers + specials;
    //  khởi tạo password
    const generatePass: string = generateRandomString(length - 4, rangeChoices);
    console.log(generatePass);
    // sáo trộn pass
    const newPass =
        charUplower +
        generateRandomString(
            length - 1,
            generatePass + charLower + charNumber + charSpecial,
        );
    return newPass;
};
