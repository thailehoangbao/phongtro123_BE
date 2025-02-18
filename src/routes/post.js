import express from 'express'
import * as postController from '../controller/post'
import verifyToken from '../middlewares/verifyToken'

const router = express.Router()
router.get('/all', postController.getPosts)
router.get('/limit', postController.getPostsLimit)
router.get('/new-post', postController.getNewPosts)

router.post('/create-new',verifyToken,postController.createNewPost)
router.get('/limit-admin',verifyToken,postController.getPostsLimitAdmin)
router.post('/update-post',verifyToken,postController.updatePost)
router.delete('/delete-post',verifyToken,postController.deletePost)
router.get('/detail-post',postController.getPostDetail)
router.post('/relative-address-post',postController.getRelativeAddressPost)

export default router