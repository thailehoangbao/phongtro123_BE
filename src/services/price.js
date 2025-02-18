import db from '../models'

// GET ALL Price
export const getPricesService = () => new Promise(async (resolve,reject) => {
    try {
        const response = await db.Price.findAll({raw:true,attributes: ['code','value']})
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK': 'Fail to get price',
            response
        })
    } catch (error) {
        reject(error)
    }
})
