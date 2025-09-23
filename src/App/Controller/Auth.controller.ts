import {
    dataDecodeJwt,
    methodRequest,
    RouteHandler,
} from '~/interfaces/express';
import User from '~/App/Model/User';
import { comparePassword, hashPass } from '~/Util/Crypto.util';
import {
    newAccessToken,
    newRefreshToken,
    setTokenInCookie,
} from '~/Util/JwtToken.util';
import { validateRegister } from '~/Util/validation.util';
import TokenService from '~/Service/Token.service';
import { deleteFileCloudinary } from '../Middleware/UploadFileCloudinary.middleware';

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
}

export default new AuthController();
