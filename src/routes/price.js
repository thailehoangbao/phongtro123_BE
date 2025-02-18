import express from 'express'
import * as controller from '../controller/price'

const router = express.Router()
router.get('/all', controller.getPrices)

export default router