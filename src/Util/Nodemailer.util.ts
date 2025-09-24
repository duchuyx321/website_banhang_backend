import { transporter } from '~/Config/nodemailer/connect.nodemailer.config';
import dotenv from 'dotenv';
dotenv.config();

export const textSendOTP = (
    name: string,
    OTP: string | number,
    expireTime: string | number | null = null,
) => {
    return {
        subject: `Your OTP - ${OTP}`,
        text: `Xin chào ${name},

Mã xác nhận của bạn là: ${OTP}. Vui lòng sử dụng mã này để truy cập vào tài khoản của bạn.

${expireTime ? `Mã này sẽ hết hạn sau ${expireTime} phút.\n\n` : ''}Nếu bạn không yêu cầu, vui lòng bỏ qua email này.

Trân trọng,
Đội ngũ Web bán hàng`,
    };
};
export const textResetPass = (name: string, Pass: string | number) => {
    return {
        subject: `Your new password`,
        text: `Xin chào ${name},

Mật khẩu mới của bạn là: **${Pass}**. 

Sau khi đăng nhập bạn sẽ được chuyển đến trang đổi mật khẩu.

Vui lòng  đổi mật khẩu ngay sau khi đăng nhập để đảm bảo an toàn.

Trân trọng,
Đội ngũ Web bán hàng`,
    };
};

export const sendMail = async (to: string, subject: string, text: string) => {
    try {
        const info = await transporter.sendMail({
            from: `"Website bán hàng" <${process.env.ADDRESS_EMAIL}>`,
            to,
            subject,
            text,
        });
        return { success: true, info };
    } catch (error) {
        console.log(error);
        return { success: false, error: (error as Error).message };
    }
};
