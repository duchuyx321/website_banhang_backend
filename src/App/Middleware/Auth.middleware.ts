import dotenv from 'dotenv';
import { verify } from 'jsonwebtoken';
import {
    dataDecodeJwt,
    methodRequest,
    RouteHandler,
} from '~/interfaces/express';
import UserService from '~/Service/User.service';
import TokenService from '~/Service/Token.service';
dotenv.config();
class AuthMiddleware {
    // verify accesstoken
    verifyJwt(token: string, key: string): Promise<dataDecodeJwt> {
        return new Promise<dataDecodeJwt>((resolve, reject) => {
            verify(token, key, (err, data) => {
                if (err || !data) return reject(err || 'jwt is incorrect'!);
                return resolve(data as dataDecodeJwt);
            });
        });
    }
    verifyTokenNotRequired: RouteHandler = async (
        req: methodRequest,
        res,
        next,
    ) => {
        try {
            let AccessToken = req.headers.authorization;
            if (!AccessToken) return next();

            AccessToken = AccessToken.split(' ')[1];

            verify(
                AccessToken,
                process.env.ACCESSTOKEN as string,
                (error, data) => {
                    if (error) {
                        return next();
                    }

                    req.user = data;
                    return next();
                },
            );
        } catch (error) {
            return res.status(500).json((error as Error).message);
        }
    };
    verifyTokenRequired: RouteHandler = async (
        req: methodRequest,
        res,
        next,
    ) => {
        try {
            let AccessToken = req.headers.authorization;
            if (!AccessToken)
                return res.status(503).json({ error: 'you not logged in!' });

            AccessToken = AccessToken.split(' ')[1];
            const data: dataDecodeJwt = await this.verifyJwt(
                AccessToken,
                process.env.ACCESSTOKEN as string,
            );
            // kiểm tra người dùng có tồn tại hay không
            const findUser = await UserService.findUser(
                data.user_id,
                data.role,
            );
            if (findUser.status !== 200) {
                return res
                    .status(findUser.status)
                    .json({ error: findUser.error });
            }
            req.user = data;
            return next();
        } catch (error) {
            return res.status(500).json((error as Error).message);
        }
    };
    verifyTokenPermission =
        (role: string): RouteHandler =>
        async (req: methodRequest, res, next) => {
            try {
                let AccessToken = req.headers.authorization;
                if (!AccessToken)
                    return res
                        .status(503)
                        .json({ error: 'you not logged in!' });

                AccessToken = AccessToken.split(' ')[1];
                const data: dataDecodeJwt = await this.verifyJwt(
                    AccessToken,
                    process.env.ACCESSTOKEN as string,
                );
                // kiểm tra người dùng có tồn tại hay không
                const findUser = await UserService.findUser(data.user_id, role);
                if (findUser.status !== 200) {
                    return res
                        .status(findUser.status)
                        .json({ error: findUser.error });
                }
                req.user = data;
                return next();
            } catch (error) {
                return res.status(500).json((error as Error).message);
            }
        };

    // verify refresh token
    verifyRefreshToken: RouteHandler = async (
        req: methodRequest,
        res,
        next,
    ) => {
        try {
            let refreshToken = req.cookies.RefreshToken as string;
            if (!refreshToken) {
                return res.status(401).json({ error: 'Please log in!' });
            }
            refreshToken = TokenService.cleanToken(refreshToken);
            const dataDecodeJwt: dataDecodeJwt = await this.verifyJwt(
                refreshToken,
                process.env.REFERESHTOKEN as string,
            );
            const checkToken = await TokenService.findToken(
                refreshToken,
                dataDecodeJwt.user_id,
            );
            if (checkToken.status !== 200) {
                return res
                    .status(checkToken.status)
                    .json({ error: checkToken.error });
            }
            // kiểm tra người dùng có tồn tại hay không
            const checkUser = UserService.findUser(
                dataDecodeJwt.user_id,
                dataDecodeJwt.role,
            );
            if (!checkUser) {
                return res.status(404).json({ error: 'user does not exist!' });
            }
            req.user = dataDecodeJwt;
            return next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };
}
export default new AuthMiddleware();
