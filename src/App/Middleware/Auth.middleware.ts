import dotenv from 'dotenv';
import { verify } from 'jsonwebtoken';
import {
    dataDecodeJwt,
    methodRequest,
    RouteHandler,
} from '~/interfaces/express';
import UserService from '~/Service/User.service';
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
}
export default new AuthMiddleware();
