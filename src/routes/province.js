import express from 'express'
import * as controller from '../controller/province'

const router = express.Router()
router.get('/all', controller.getProvinces)

export default router