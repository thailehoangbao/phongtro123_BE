import db from '../models'
import bcrypt from 'bcryptjs'

const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(12))
// GET current user
export const getOne = (id) => new Promise(async (resolve,reject) => {
    try {
        const response = await db.User.findOne({
            where: { id },
            raw:true,
            attributes: {
                exclude: ['password']
            }
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK': 'Fail to get user',
            response
        })
    } catch (error) {
        reject(error)
    }
})

export const updateUser = (user,id) => new Promise(async (resolve,reject) => {
    try {
        let newUser = {
            ...user,
            zalo: `https://zalo.me/${user.phone}`,
            // password: hashPassword(user.password)
        }
        const response = await db.User.update(newUser,{
            where: { id }
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK': 'Fail to get user',
            response
        })
    } catch (error) {
        reject(error)
    }
})


export const updatePassword = (body, userId) => new Promise(async (resolve, reject) => {
    try {
        const hashedPassword = bcrypt.hashSync(body.password, bcrypt.genSaltSync(12)); // Hash mật khẩu mới

        const response = await db.User.update(
            { password: hashedPassword },  // Cập nhật cột password
            { where: { id: userId } }      // Điều kiện: user có id tương ứng
        );

        resolve({
            err: response[0] > 0 ? 0 : 1,  // response[0] là số bản ghi được cập nhật
            msg: response[0] > 0 ? 'Password updated successfully!' : 'Fail to update password',
        });
    } catch (error) {
        reject(error);
    }
});
