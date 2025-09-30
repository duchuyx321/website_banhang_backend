import {
    dataDecodeJwt,
    methodRequest,
    RouteHandler,
} from '~/interfaces/express';
import TokenService from '~/Service/Token.service';
import UserService from '~/Service/User.service';
import { comparePassword, createOTP } from '~/Util/Crypto.util';
import { sendMail, textSendOTP } from '~/Util/Nodemailer.util';
import { IData, validateValue } from '~/Util/validation.util';

class MeController {
    // -- [GET] -- /user/me
    getProfileMe: RouteHandler = async (req: methodRequest, res) => {
        try {
            const profile = req.user as dataDecodeJwt;
            const select =
                'username email avatar.image_url first_name last_name';
            const user = await UserService.findUser(
                profile.user_id,
                profile.role,
                select,
            );
            if (user.status !== 200)
                return res.status(user.status).json({ error: user.error });

            return res.status(200).json({ data: user.data });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    //  -- [POST] --/user/me/email/send
    sendMailMe: RouteHandler = async (req: methodRequest, res) => {
        try {
            const { user_id, role } = req.user as dataDecodeJwt;
            const select = 'email first_name last_name';
            const user = await UserService.findUser(user_id, role, select);
            if (user.status !== 200)
                return res.status(user.status).json({ erorr: user.error });

            //  gửi mã otp về cho người dùng
            const expireTime = 5;
            const OTP = await createOTP(6, 'upper');
            //  lưu mã xác nhận vào trong db
            await TokenService.saveSingleToken(OTP, user_id, `${expireTime}m`);
            // gửi token đến cho người dùng
            const { subject, text } = textSendOTP(
                `${user.data?.first_name} ${user.data?.last_name}`,
                OTP,
                expireTime,
            );
            const sendMailUser = await sendMail(
                user.data?.email as string,
                subject,
                text,
            );
            if (!sendMailUser.success) {
                return res.status(503).json({ error: sendMailUser.error });
            }
            return res
                .status(200)
                .json({ data: { message: 'send OTP to user successful!' } });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    //  -- [PATCH] --/user/me
    editMeProfile: RouteHandler = async (req: methodRequest, res) => {
        try {
            const profile = req.user as dataDecodeJwt;
            const safeFields = ['first_name', 'last_name', 'thumbnail', 'bio'];
            const dataEdit = req.body; // gửi lên có các thông tin liên quan
            //  lấy dữ liệu thay đổi an toàn
            const safeData: IData = {};
            for (const field of safeFields) {
                const key = field as keyof IData;
                if (dataEdit[key] !== undefined) {
                    safeData[key] = dataEdit[key];
                }
            }
            //  kiểm tra dữ liệu
            if (dataEdit.username) {
                const checkUsername =
                    await UserService.findUserFlowUsernameOrEmail(
                        dataEdit.username,
                    );
                if (checkUsername.status === 200) {
                    return res
                        .status(403)
                        .json({ erorr: 'username has existed!' });
                }
                safeData.username = dataEdit.username;
            }
            // check lỗi và edit
            const editProfileMe = await UserService.editProfileUser(
                profile.user_id,
                safeData,
            );
            if (editProfileMe.status !== 200)
                return res
                    .status(editProfileMe.status)
                    .json({ eror: editProfileMe.error });
            return res
                .status(200)
                .json({ data: { message: editProfileMe.message } });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    // verify OTP
    verifyOTP: RouteHandler = async (req: methodRequest, res, next) => {
        try {
            const { user_id } = req.user as dataDecodeJwt;
            const { OTP } = req.body;
            if (!user_id || !OTP)
                return res.status(400).json({
                    error: 'Missing required fields: user_id or OTP',
                });

            const { error } = validateValue({ OTP });
            if (error) {
                return res
                    .status(401)
                    .json({ error: error.details.map((d) => d.message) });
            }
            // check OTP
            const checkToken = await TokenService.findToken(OTP, user_id);
            if (checkToken.status !== 200) {
                return res
                    .status(checkToken.status)
                    .json({ error: checkToken.error });
            }
            next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    // change email
    changeEmail: RouteHandler = async (req: methodRequest, res) => {
        try {
            const { user_id } = req.user as dataDecodeJwt;
            const { email } = req.body;
            if (!user_id || !email)
                return res.status(400).json({
                    error: 'Missing required fields: user_id or email',
                });
            const { error } = validateValue({ email });
            if (error) {
                return res
                    .status(401)
                    .json({ error: error.details.map((d) => d.message) });
            }
            const checkEmail =
                await UserService.findUserFlowUsernameOrEmail(email);
            if (checkEmail.status === 200) {
                return res.status(403).json({ erorr: 'Email has existed!' });
            }
            // check lỗi và edit
            const editEmail = await UserService.editProfileUser(user_id, {
                email,
            });
            if (editEmail.status !== 200)
                return res
                    .status(editEmail.status)
                    .json({ eror: editEmail.error });
            return res
                .status(200)
                .json({ data: { message: editEmail.message } });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    // change password
    changePassword: RouteHandler = async (req: methodRequest, res) => {
        try {
            const { user_id, role } = req.user as dataDecodeJwt;
            const { password, newPassword, confirmPassword } = req.body;
            const { error } = validateValue({
                password,
                newPassword,
                confirmPassword,
            });
            if (error) {
                return res
                    .status(401)
                    .json({ error: error.details.map((d) => d.message) });
            }
            if (password === newPassword)
                return res.status(401).json({
                    error: 'New password is not the same as old password!',
                });
            if (newPassword !== confirmPassword)
                return res.status(401).json({
                    error: 'New password and confirm password are not the same!',
                });
            const user = await UserService.findUser(user_id, role, 'password');
            if (user.status !== 200)
                return res.status(user.status).json({ error: user.error });
            //  check old pass
            const isCheckOldPassword = await comparePassword(
                password,
                user?.data?.password as string,
            );
            if (!isCheckOldPassword)
                return res
                    .status(401)
                    .json({ error: 'old password incorrect!' });

            //  lưu mật khẩu vào db
            const changePass = await UserService.resetPassword(
                user_id,
                newPassword,
            );
            if (!changePass.success) {
                return res.status(503).json({ error: changePass.error });
            }
            return res
                .status(503)
                .json({ data: { message: changePass.message } });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
}

export default new MeController();
