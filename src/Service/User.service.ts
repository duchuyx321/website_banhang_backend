import User from '~/App/Model/User';
import { hashPass } from '~/Util/Crypto.util';
import { IData, validateValue } from '~/Util/validation.util';
class UserService {
    // find user method role
    async findUser(
        user_id: string,
        role: string = 'User',
        select: string = '',
    ) {
        try {
            const user = await User.findOne({
                _id: user_id,
                role: role,
                isBlock: false,
            }).select(select);
            if (!user) {
                return { status: 404, error: 'user does not exist!' };
            }
            return { status: 200, message: 'user exists!', data: user };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
    // find user flow username or email
    async findUserFlowUsernameOrEmail(identifier: string, select: string = '') {
        try {
            const user = await User.find({
                $or: [{ username: identifier }, { email: identifier }],
                isBlock: false,
            }).select(select);
            if (!user) {
                return { status: 404, error: 'user does not exist!' };
            }
            return { status: 200, user };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
    // reset Password
    async resetPassword(user_id: string, password: string) {
        try {
            const saltPass = await hashPass(password);
            const resetPass = await User.updateOne(
                { _id: user_id },
                { $set: { password: saltPass } },
            );
            if (resetPass.modifiedCount === 0) {
                return { success: false, error: 'reset password is failed!' };
            }
            return { success: true, message: 'reset password is successful!' };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
    // edit profile
    async editProfileUser(user_id: string, dataEdit: IData) {
        try {
            const { error } = validateValue(dataEdit);
            if (error) {
                return {
                    status: 400,
                    error: error.details.map((d) => d.message),
                };
            }
            const editProfile = await User.updateOne(
                { _id: user_id },
                { $set: dataEdit },
            );
            if (editProfile.modifiedCount === 0) {
                return {
                    status: 503,
                    error: 'edit profile user is faild!',
                };
            }
            return {
                status: 200,
                message: 'edit profile user is successful!',
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}

export default new UserService();
