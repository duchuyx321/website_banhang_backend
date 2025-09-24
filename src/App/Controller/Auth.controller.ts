import {
    dataDecodeJwt,
    methodRequest,
    RouteHandler,
} from '~/interfaces/express';
import User from '~/App/Model/User';
import {
    comparePassword,
    createOTP,
    hashPass,
    resetPass,
} from '~/Util/Crypto.util';
import {
    newAccessToken,
    newRefreshToken,
    setTokenInCookie,
} from '~/Util/JwtToken.util';
import { validateRegister, validateValue } from '~/Util/validation.util';
import TokenService from '~/Service/Token.service';
import { deleteFileCloudinary } from '../Middleware/UploadFileCloudinary.middleware';
import UserService from '~/Service/User.service';
import { sendMail, textResetPass, textSendOTP } from '~/Util/Nodemailer.util';

class AuthController {
    // -- [POST] -- /auth/login
    login: RouteHandler = async (req, res) => {
        try {
            const identifier = req.body.identifier;
            const pass = req.body.password;

            if (!identifier || !pass) {
                return res
                    .status(400)
                    .json({ error: 'Incomplete data upload!' });
            }
            // kiểm tra thông thông tin người dùng
            const checkUser = await User.findOne({
                $or: [{ username: identifier }, { email: identifier }],
                isBlock: false,
            })
                .select('username email password avatar first_name last_name')
                .lean();

            if (!checkUser)
                return res.status(401).json({ error: 'user does not exist!' });

            // kiểm tra mật khẩu
            const isCorrectPass = await comparePassword(
                pass,
                checkUser.password,
            );
            if (!isCorrectPass)
                return res.status(401).json({ error: 'wrong password!' });

            // cấp phiên đăng nhập
            const profile = {
                user_id: checkUser._id,
                role: checkUser.role,
            };
            const AccessToken = newAccessToken(profile);
            const RefreshToken = newRefreshToken(profile);
            res.cookie('RefreshToken', RefreshToken, setTokenInCookie());
            // lưu token vào trong db
            await TokenService.addToken(RefreshToken, checkUser._id);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...other } = checkUser;

            return res.status(200).json({
                data: {
                    other,
                    meta: {
                        AccessToken,
                    },
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    //  -- [POST] -- /auth/register
    register: RouteHandler = async (req, res) => {
        try {
            const { error } = validateRegister(req.body);
            if (error) {
                if (req.body.thumbnail?.public_id) {
                    await deleteFileCloudinary(req.body.thumbnail?.public_id);
                }
                return res
                    .status(401)
                    .json({ error: error.details.map((d) => d.message) });
            }
            const { username, email, thumbnail, first_name, last_name } =
                req.body;
            const pass = req.body.password;
            // find user
            const findUserFlowUsername = await User.findOne({ username });
            if (findUserFlowUsername)
                return res
                    .status(501)
                    .json({ error: 'Username already exists!' });
            const findUserFlowEmail = await User.findOne({ email });
            if (findUserFlowEmail)
                return res.status(501).json({ error: 'Email already exists!' });
            // hashpass
            const saltPass = await hashPass(pass);
            // lưu thông tin người dùng
            const newUser = new User({
                username,
                email,
                avatar: thumbnail,
                password: saltPass,
                first_name,
                last_name,
            });
            await newUser.save();
            // lấy token
            // cấp phiên đăng nhập
            const profile = {
                user_id: newUser._id,
                role: newUser.role,
            };
            const AccessToken = newAccessToken(profile);
            const RefreshToken = newRefreshToken(profile);
            res.cookie('RefreshToken', RefreshToken, setTokenInCookie());
            await TokenService.addToken(RefreshToken, newUser._id);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...other } = newUser.toObject();
            return res.status(200).json({
                data: {
                    other,
                    meta: {
                        AccessToken,
                    },
                },
            });
        } catch (error) {
            if (req.body.thumbnail?.public_id) {
                await deleteFileCloudinary(req.body.thumbnail?.public_id);
            }
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    // -- [POST] --/auth/refresh
    refresh: RouteHandler = async (req: methodRequest, res) => {
        try {
            const user = req.user as dataDecodeJwt;
            const profile = {
                user_id: user.user_id,
                role: user.role,
            };
            const AccessToken = newAccessToken(profile);
            const RefreshToken = newRefreshToken(profile, user.exp);
            res.cookie('RefreshToken', RefreshToken, setTokenInCookie());
            // lưu token vào trong db
            await TokenService.addToken(RefreshToken, user.user_id);
            return res.status(200).json({ data: { meta: { AccessToken } } });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    //  -- [POST] --/auth/logout
    logout: RouteHandler = async (req: methodRequest, res) => {
        try {
            // xóa phiên đăng nhập trong hệ thống
            const { user_id } = req.user as dataDecodeJwt;
            const token = req.cookies.RefreshToken;
            await TokenService.deleteToken(token, user_id);
            // xóa refresh token
            res.clearCookie('RefreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });
            return res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    // -- [POST] -- /auth/forgot-pass
    forgotPass: RouteHandler = async (req: methodRequest, res) => {
        try {
            const { identifier } = req.body;
            if (!identifier)
                return res.status(402).json({ error: 'not data to upload!' });
            //find user
            const select = 'avatar.image_url first_name last_name email';
            const findUser = await UserService.findUserFlowUsernameOrEmail(
                identifier,
                select,
            );
            if (findUser.status !== 200) {
                return res
                    .status(findUser.status)
                    .json({ erorr: findUser.error });
            }
            return res.status(200).json({ data: findUser.user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
    // -- [POST] -- /auth/otp/email
    sendMailOTP: RouteHandler = async (req, res) => {
        try {
            const { user_id, email } = req.body;

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
            const checkUser = await User.findOne({
                _id: user_id,
                email,
            }).select('first_name last_name');

            if (!checkUser)
                return res.status(404).json({ error: 'Invalid user data' });

            // sendOTP mail
            const expireTime = 5;
            const OTP = await createOTP(6, 'upper');
            //  lưu mã xác nhận vào trong db
            await TokenService.saveSingleToken(OTP, user_id, `${expireTime}m`);
            // gửi token đến cho người dùng
            const { subject, text } = textSendOTP(
                `${checkUser.first_name} ${checkUser.last_name}`,
                OTP,
                expireTime,
            );
            const sendMailUser = await sendMail(email, subject, text);
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
    // -- [POST] -- /auth/reset-pass
    resetPassword: RouteHandler = async (req, res) => {
        try {
            const { user_id, OTP } = req.body;
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
            // tìm kiếm user
            const user = await User.findById(user_id).select(
                'email first_name last_name',
            );
            if (!user) {
                return res.status(404).json({ error: 'user does not exist!' });
            }
            // tạo mật khẩu mới
            const newPass = await resetPass();
            const { subject, text } = textResetPass(
                `${user.first_name} ${user.last_name}`,
                newPass,
            );
            //  chỉnh sửa mật khẩu
            const resetPassInDB = await UserService.resetPassword(
                user_id,
                newPass,
            );
            if (!resetPassInDB.success) {
                return res.status(503).json({ error: resetPassInDB.error });
            }
            // send mail user
            const sendMailUser = await sendMail(user.email, subject, text);
            if (!sendMailUser.success) {
                return res.status(503).json({ error: sendMailUser.error });
            }
            return res.status(200).json({
                data: {
                    message: 'We have sent a new password to your email!',
                },
            });
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    };
}

export default new AuthController();
