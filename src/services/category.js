import db from '../models'

// GET ALL CATEGORY
export const getCategoriesService = () => new Promise(async (resolve,reject) => {
    try {
        const response = await db.Category.findAll({raw:true})
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK': 'Fail to get category',
            response
        })
    } catch (error) {
        reject(error)
    }
})