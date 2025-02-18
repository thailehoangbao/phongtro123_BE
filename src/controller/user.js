import * as service from '../services/user'

export const getCurrent = async (req,res) => {
    const id = req.user.id
    try {
        const response = await service.getOne(id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at category controller ' + error
        })
    }
}

export const updateUser = async (req,res) => {
    const id = req.user.id
    try {
        const response = await service.updateUser(req.body,id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at category controller ' + error
        })
    }
}

export const updatePassword = async (req,res) => {
    const id = req.user.id
    try {
        const response = await service.updatePassword(req.body,id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at category controller ' + error
        })
    }
}