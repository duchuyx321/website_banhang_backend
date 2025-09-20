import JWT, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import ms, { StringValue } from 'ms';
import { IUser } from '~/interfaces/ModelDatabase';
dotenv.config();

export interface IProfile {
    user_id: IUser['_id'] | string;
    role: string;
}

const accessTokenSecret = process.env.ACCESSTOKEN ?? '';
const accessTokenTime = process.env.ACCESSTOKEN_TIME ?? '1h';
const refreshTokenSecret = process.env.REFERESHTOKEN ?? '';
const refreshTokenTime = (process.env.ACCESSTOKEN_TIME ?? '8h') as StringValue;

export const newAccessToken = (profile: IProfile): string => {
    const options: SignOptions = {
        expiresIn: accessTokenTime as JWT.SignOptions['expiresIn'],
    };

    const token = JWT.sign(profile, accessTokenSecret, options);
    const accessToken = `Bearer ${token}`;
    return accessToken;
};

export const newRefreshToken = (
    profile: IProfile,
    expiresIn?: number | StringValue,
): string => {
    const options: SignOptions = {
        expiresIn:
            expiresIn ?? (refreshTokenTime as JWT.SignOptions['expiresIn']),
    };

    const token = JWT.sign(profile, refreshTokenSecret, options);
    const refreshToken = `Bearer ${token}`;
    return refreshToken;
};

export const setTokenInCookie = () => {
    const expires = ms(refreshTokenTime);
    return {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'strict' as const,
        expires: new Date(Date.now() + expires),
    };
};
