import * as service from '../services/price'

export const getPrices = async (req,res) => {
    try {
        const response = await service.getPricesService()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at category controller ' + error
        })
    }
}