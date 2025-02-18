import db from '../models'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
require('dotenv').config()

const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(12))

export const registerService = ({phone,password,name}) => new Promise(async(resolve,reject) => {
    try {
        const response = await db.User.findOrCreate({
            where: {phone},
            defaults: {
                phone,
                name,
                password: hashPassword(password),
                zalo: `https://zalo.me/${phone}`,
                id: v4()
            }
        })
        //nếu response[1] = true thì tạo token, ngược lại false tức là tk đã tồn tại thì gán token = false
        const token = response[1] && jwt.sign({id: response[0].id, phone:response[0].phone},process.env.SECRET_KEY, {
            expiresIn: '2d'
        })
        resolve({
            err: token ? 0 : 2,
            msg: token ? 'Register is successfully!' : 'Phone number has been already',
            token: token || null
        })
    } catch (error) {
        reject(error)
    }
})

export const loginService = ({phone,password}) => new Promise(async(resolve,reject) => {
    try {
        const response = await db.User.findOne({
            where: {phone},
            raw: true
        })

        const isCorrectPassword = response && bcrypt.compareSync(password, response.password)

        const token = isCorrectPassword && jwt.sign({id: response.id, phone:response.phone},process.env.SECRET_KEY, {
            expiresIn: '2d'
        })
        resolve({
            err: token ? 0 : 2,
            msg: token ? 'Login is successfully!' : response ? 'Password không đúng' : 'Không tìm thấy tài khoản',
            token: token || null
        })
    } catch (error) {
        reject(error)
    }
})