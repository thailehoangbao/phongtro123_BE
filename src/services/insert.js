import db from '../models'
import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'
import chothuephongtro from '../../data/chothuephongtro.json'
import nhachothue from '../../data/nhachothue.json'
import chothuecanho from '../../data/chothuecanho.json'
import chothuematbang from '../../data/chothuematbang.json'
import generateCode from '../utils/generateCode'
import { dataPrice, dataArea } from '../utils/data'
import {getNumberFromString} from '../utils/common'
require('dotenv').config()
const dataBody = [
    {
        body: chothuematbang.body,
        code: 'CTMB'
    },
    {
        body: chothuecanho.body,
        code: 'CTCH'
    },
    {
        body: nhachothue.body,
        code: 'NCT'
    },
    {
        body: chothuephongtro.body,
        code: 'CTPT'
    }
]

const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(12))

export const insertService = () => new Promise( async (resolve,reject) => {
    try {
        const provinceCodes = []
        const labelCodes = []
        dataBody.forEach(cate => {
            cate.body.forEach(async (item) => {
                let postId = v4();
                let attributesId = v4()
                let labelCode = generateCode(item?.header?.address).trim()
                labelCodes?.every(item => item?.code !== labelCode) && labelCodes.push({
                    code: labelCode,
                    value: item?.header?.address?.trim()
                })
                let provinceCode= generateCode(item?.header?.address?.split(',').slice(-1)[0]).trim()
                provinceCodes?.every(item => item?.code !== provinceCode) && provinceCodes.push({
                    code: provinceCode,
                    value: item?.header?.address?.split(',').slice(-1)[0].trim()
                })
                let userId = v4()
                let imagesId = v4()
                let overviewId = v4()
                let currentArea = getNumberFromString(item?.header?.attributes?.square)
                let currentPrice = getNumberFromString(item?.header?.attributes?.price)
                await db.Post.create({
                    id: postId,
                    title: item?.header?.title,
                    star: item?.header?.star,
                    labelCode,
                    address: item?.header?.address,
                    attributesId,
                    categoryCode: cate.code,
                    description: item?.mainContent?.content,
                    userId,
                    overviewId,
                    imagesId,
                    areaCode: dataArea.find(area => area.max >= currentArea && area.min <= currentArea)?.code,
                    priceCode: dataPrice.find(price => price.max >= currentPrice && price.min <= currentPrice)?.code,
                    provinceCode,
                    priceNumber: +currentPrice,
                    areaNumber: +currentArea
                })
    
                await db.Attribute.create({
                    id: attributesId,
                    price: item?.header.attributes?.price,
                    acreage: item?.header.attributes?.square,
                    hashtag: item?.header.attributes?.time,
                })
    
                await db.Image.create({
                    id: imagesId,
                    image: JSON.stringify(item?.images)
                })
    
                await db.Label.findOrCreate({
                    where : {code : labelCode},
                    defaults: {
                        code: labelCode,
                        value: item?.header?.address
                    }
                })
    
    
                await db.Overview.create({
                    id: overviewId,
                    code: item?.overview?.content[0].title,
                    created: item?.overview?.content[2].title,
                    expire: item?.overview?.content[3].title,
                    type: item?.overview?.header,
                    area: item?.header?.address,
                    target: item?.overview?.content[1].title,
                })
    
                await db.User.create({
                    id: userId,
                    name: item?.detailContact?.descriptionContactContent?.name,
                    phone: item?.detailContact?.descriptionContactContent?.contact?.tel,
                    zalo: item?.detailContact?.descriptionContactContent?.contact?.zalo,
                    password: hashPassword('123456')
                })
            })
        })


        provinceCodes.forEach(async(item) => {
            await db.Province.findOrCreate({
                where: {code: item.code},
                defaults: {
                    code: item.code,
                    value: item.value
                }
            })
        })

        labelCodes.forEach(async(item) => {
            await db.Label.findOrCreate({
                where: {code: item.code},
                defaults: {
                    code: item.code,
                    value: item.value
                }
            })
        })

        resolve("Done")
    } catch (error) {
        reject(error)
    }
})
export const createPriceAndArea = () => new Promise(async(resolve,reject) => {
    try {
        dataPrice.forEach(async(item) => {
            await db.Price.create({
                code:item.code,
                value: item.value
            })
        })
        dataArea.forEach(async(item) => {
            await db.Area.create({
                code:item.code,
                value: item.value
            })
        })
        resolve("Ok")
    } catch (error) {
        reject(error)
    }
})
