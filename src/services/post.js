import db from '../models'
import {v4 as generateId} from 'uuid'
import generateCode from '../utils/generateCode'
import moment from 'moment'
const {Op} = require('sequelize')
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

export const getPostsService = () => new Promise(async (resolve,reject) => {
    try {
        const response = await db.Post.findAll({
            raw: true,
            nest:true,
            include: [
                { model: db.Image, as: 'images', attributes: ['image']},
                { model: db.Attribute, as: 'attributes', attributes:['price','acreage','published','hashtag']},
                { model: db.User, as: 'user', attributes:['name','zalo','phone']}
            ],
            attributes: ['id','title','star','address','description']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'Ok' : 'Get post failed',
            response
        })
    } catch (error) {
        reject(error)
    }
})

export const getPostsLimitService = (page,query,{priceNumber,areaNumber}) => new Promise(async (resolve,reject) => {
    try {
        let offset = (!page || +page <1) ? 0 : (+page - 1)
        const queries = {
            ...query
        }
        if(priceNumber) queries.priceNumber = {[Op.between]:priceNumber}
        if(areaNumber) queries.areaNumber = {[Op.between]:areaNumber}
        const response = await db.Post.findAndCountAll({
            where: queries,
            raw: true,
            nest:true,
            offset:  offset* (+process.env.LIMIT),
            limit: +process.env.LIMIT,
            order: [['createdAt','DESC']],
            include: [
                { model: db.Image, as: 'images', attributes: ['image']},
                { model: db.Attribute, as: 'attributes', attributes:['price','acreage','published','hashtag']},
                { model: db.User, as: 'user', attributes:['name','zalo','phone']}
            ],
            attributes: ['id','title','star','address','description']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'Ok' : 'Get post failed',
            response
        })
    } catch (error) {
        reject(error)
    }
})

export const getRelativeAddressPostService = (address) => new Promise(async (resolve,reject) => {
    try {
        const response = await db.Post.findAll({
            where: {
                address: {
                  [Op.like]: `%${address}%` // Tìm các bài viết chứa chuỗi địa chỉ
                }
            },
            order: [['createdAt', 'DESC']], // Sắp xếp theo thời gian tạo mới nhất
            limit: 8, // Giới hạn 8 bài viết
            include: [
                { model: db.Image, as: 'images', attributes: ['image']},
                { model: db.Attribute, as: 'attributes', attributes:['price','acreage','published','hashtag']},
                { model: db.Overview, as: 'overviews', attributes:['type','target','created','expired','code','area']},
                { model: db.User, as: 'user', attributes:['name','zalo','phone']}
            ],
            attributes: ['id','title','star','address','description']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'Ok' : 'Get post failed',
            response
        })
    } catch (error) {
        reject(error)
    }
})

export const getPostsDetailService = (id) => new Promise(async (resolve,reject) => {
    try {
        const response = await db.Post.findAndCountAll({
            where: {id: id},
            include: [
                { model: db.Image, as: 'images', attributes: ['image']},
                { model: db.Attribute, as: 'attributes', attributes:['price','acreage','published','hashtag']},
                { model: db.Overview, as: 'overviews', attributes:['type','target','created','expired','code','area']},
                { model: db.User, as: 'user', attributes:['name','zalo','phone']}
            ],
            attributes: ['id','title','star','address','description']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'Ok' : 'Get post failed',
            response
        })
    } catch (error) {
        reject(error)
    }
})

export const getNewPostService = () => new Promise(async (resolve,reject) => {
    try {
        const response = await db.Post.findAll({
            raw: true,
            nest:true,
            offset:  0,
            order: [
                ['createdAt','DESC']
            ],
            limit: +process.env.LIMIT,
            include: [
                { model: db.Image, as: 'images', attributes: ['image']},
                { model: db.Attribute, as: 'attributes', attributes:['price','acreage','published','hashtag']},
            ],
            attributes: ['id','title','star','description','createdAt']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'Ok' : 'Get post failed',
            response
        })
    } catch (error) {
        reject(error)
    }
})


export const createNewPostService = (body, userId) => new Promise(async (resolve,reject) => {
    try {
        const postId = generateId()
        const attributesId = generateId()
        const imagesId = generateId()
        const overviewId = generateId()
        const currentDate = moment();
        const expireDate = currentDate.clone().add(1, 'days'); // Tạo bản sao của currentDate
        const labelCode = generateCode(body.address)
        await db.Province.findOrCreate({
            where: {value: body.province},
            defaults: {
                code: generateCode(body.province),
                value: body.province
            }
        })
        const response = await db.Post.create({
                    id: postId,
                    title: body.title || null,
                    labelCode,
                    address: body.address || null,
                    attributesId,
                    categoryCode: body.categoryCode,
                    description: body.description || null,
                    userId,
                    overviewId,
                    imagesId,
                    areaCode: body.areaCode || null,
                    priceCode: body.priceCode || null,
                    provinceCode: generateCode(body.province) || null,
                    priceNumber: +body.priceNumber,
                    areaNumber: +body.areaNumber
        })

        await db.Image.create({
            id: imagesId,
            image: JSON.stringify(body.images)
        })

        await db.Attribute.create({
            id: attributesId,
            price:  +body.priceNumber < 1 ? `${+body.priceNumber*1000000} đồng/tháng` : `${body.priceNumber} triệu/tháng`,
            acreage: `${body.areaNumber} m2`,
            published: moment(currentDate).format('DD/MM/YYYY'),
            hashtag: `Cập nhật ${dayjs().from(currentDate, true)}`,
        });

        await db.Label.findOrCreate({
            where : {code : labelCode},
            defaults: {
                code: labelCode,
                value: body.address
            }
        })

        await db.Overview.create({
            id: overviewId,
            code: `Mã tin : ${Math.floor(100000 + Math.random() * 900000)}`,
            created: currentDate,
            expired: `${expireDate.format('YYYY/MM/DD HH:mm:ss')}`,
            type: body.categoryCode,
            area: body.address,
            target: body.target,
        })
    

        resolve({
            err: response ? 0 : 1,
            msg: response ? 'Ok' : 'Create post failed',
            response
        })
    } catch (error) {
        reject(error)
    }
})

export const getPostsLimitServiceAdmin = (page,id,query) => new Promise(async (resolve,reject) => {
    try {
        let offset = (!page || +page <1) ? 0 : (+page - 1)
        const queries = {
            ...query, 
            userId: id
        }
        const response = await db.Post.findAndCountAll({
            where: queries,
            raw: true,
            nest:true,
            offset:  offset* (+process.env.LIMIT),
            limit: +process.env.LIMIT,
            order: [['createdAt','DESC']],
            include: [
                { model: db.Image, as: 'images', attributes: ['image']},
                { model: db.Attribute, as: 'attributes', attributes:['price','acreage','published','hashtag']},
                { model: db.User, as: 'user', attributes:['name','zalo','phone']},
                { model: db.Overview, as: 'overviews', attributes:['type','target','created','expired','code','area']}
            ],
            // attributes: ['id','title','star','address','description']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'Ok' : 'Get post failed',
            response
        })
    } catch (error) {
        reject(error)
    }
})


export const updatePostService = (body, userId) => new Promise(async (resolve,reject) => {
    try {
        const postId = body.postId
        const attributesId = body.attributesId
        const imagesId = body.imagesId
        const overviewId = body.overviewId
        const currentDate = moment();
        const expireDate = currentDate.clone().add(1, 'days'); // Tạo bản sao của currentDate
        const labelCode = generateCode(body.address)
        await db.Province.findOrCreate({
            where: {value: body.province},
            defaults: {
                code: generateCode(body.province),
                value: body.province
            }
        })
        const response = await db.Post.update({
                    title: body.title || null,
                    labelCode,
                    address: body.address || null,
                    attributesId,
                    categoryCode: body.categoryCode,
                    description: body.description || null,
                    userId,
                    overviewId,
                    imagesId,
                    areaCode: body.areaCode || null,
                    priceCode: body.priceCode || null,
                    provinceCode: generateCode(body.province) || null,
                    priceNumber: +body.priceNumber,
                    areaNumber: +body.areaNumber
        },{where: {id: postId}})

        await db.Image.update({
            image: JSON.stringify(body.images)
        },{where: {id: imagesId}})

        await db.Attribute.update({
            price:  +body.priceNumber < 1 ? `${+body.priceNumber*1000000} đồng/tháng` : `${body.priceNumber} triệu/tháng`,
            acreage: `${body.areaNumber} m2`,
            published: moment(currentDate).format('DD/MM/YYYY'),
            hashtag: `Cập nhật ${dayjs().from(currentDate, true)}`,
        },{where: {id: attributesId}});

        await db.Label.findOrCreate({
            where : {code : labelCode},
            defaults: {
                code: labelCode,
                value: body.address
            }
        })

        await db.Overview.update({
            code: `Mã tin : ${Math.floor(100000 + Math.random() * 900000)}`,
            created: currentDate,
            expired: `${expireDate.format('DD/MM/YYYY HH:mm:ss')}`,
            type: body.categoryCode,
            area: body.address,
            target: `Gói tin: tin VIP ${Math.floor(Math.random() * 3) + 1}`,
        },{where: {id: overviewId}})
    

        resolve({
            err: response ? 0 : 1,
            msg: response ? 'Ok' : 'Update post failed',
            response
        })
    } catch (error) {
        reject(error)
    }
})

export const deletePostService = (body, userId) => new Promise(async (resolve, reject) => {
    const { postId, overviewId, attributesId, imagesId } = body;

    try {
        // Xóa hình ảnh trước tiên để tránh lỗi ràng buộc khóa ngoại
        await db.Image.destroy({ where: { id: imagesId } });

        // Xóa thuộc tính của bài đăng
        await db.Attribute.destroy({ where: { id: attributesId } });

        // Xóa thông tin tổng quan của bài đăng
        await db.Overview.destroy({ where: { id: overviewId } });

        // Cuối cùng, xóa bài đăng chính
        const response = await db.Post.destroy({
            where: { id: postId, userId: userId } // Đảm bảo chỉ xóa bài đăng của user hiện tại
        });

        resolve({
            err: response ? 0 : 1,
            msg: response ? 'Delete post successfully' : 'Delete post failed',
            response
        });
    } catch (error) {
        reject(error);
    }
})


