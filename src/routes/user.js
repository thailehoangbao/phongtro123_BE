import express from 'express'
import verifyToken from '../middlewares/verifyToken'
import * as userController from '../controller/user'
const router = express.Router()
router.use(verifyToken)
router.get('/get-current', userController.getCurrent)
router.post('/update-user',verifyToken, userController.updateUser)
router.post('/update-password',verifyToken, userController.updatePassword)
export default router