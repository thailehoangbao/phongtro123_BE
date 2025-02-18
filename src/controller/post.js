import * as postService from '../services/post'

export const getPosts = async (req,res) => {
    try {
        const response = await postService.getPostsService()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at post controller '
        })
    }
}

export const getPostsLimit = async (req,res) => {
    const { page,priceNumber,areaNumber,...query } = req.query
    try {
        const response = await postService.getPostsLimitService(page,query,{priceNumber,areaNumber})
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at post controller ' + error
        })
    }
}

export const getNewPosts = async (req,res) => {
    try {
        const response = await postService.getNewPostService()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at post controller ' + error
        })
    }
}

export const getPostDetail = async (req,res) => {
    try {
        const response = await postService.getPostsDetailService(req.query.id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at post controller ' + error
        })
    }
}

export const getRelativeAddressPost = async (req,res) => {
    try {
        const response = await postService.getRelativeAddressPostService(req.body.address)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at post controller ' + error
        })
    }
}

export const createNewPost = async (req,res) => {
    try {
        const {categoryCode,title,priceNumber,areaNumber } = req.body
        const { id } = req.user
        if(!categoryCode || !id || !title || !areaNumber || !priceNumber) return res.status(400).json({
            err:1,
            msg: 'Missing inputs'
        })
        const response = await postService.createNewPostService(req.body, id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at post controller ' + error
        })
    }
}

export const getPostsLimitAdmin = async (req,res) => {
    const { page,...query } = req.query
    const { id } = req.user
    try {
        if(!id) return res.status(400).json({
            err: 1,
            msg: 'Missing input'
        })
        const response = await postService.getPostsLimitServiceAdmin(page,id,query)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at post controller ' + error
        })
    }
}


export const updatePost = async (req,res) => {
    try {
        const { categoryCode,title,priceNumber,areaNumber } = req.body
        const { id } = req.user
        if(!categoryCode || !id || !title || !areaNumber || !priceNumber) return res.status(400).json({
            err:1,
            msg: 'Missing inputs'
        })
        const response = await postService.updatePostService(req.body, id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at post controller ' + error
        })
    }
}

export const deletePost = async (req,res) => {
    try {
        const { postId,overviewId,attributesId,imagesId } = req.body
        const { id } = req.user
        if(!postId || !overviewId || !attributesId || !imagesId) return res.status(400).json({
            err:1,
            msg: 'Missing inputs'
        })
        const response = await postService.deletePostService(req.body, id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at post controller ' + error
        })
    }
}