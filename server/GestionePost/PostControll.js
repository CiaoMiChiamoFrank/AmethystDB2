const {createPostService, updatePostService, getPostService, deletePostService} = require('./PostService')
const express = require ('express')
const routPost = express.Router()

routPost.get ('/createPost', async (res, req) => {
    const bool = await createPostService(1, '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 'Spancato 100kg', 'Ieri, grazie al mio spot ho spancato 100kg.', 'Pluto', '')
    req.json(bool)
})

routPost.get('/deletePost', async (res, req) => {
    const bool = await deletePostService('6831fd415bf12cd21d4f1852', '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    req.json(bool)
})

routPost.get('/getPost', async (res, req) => {
    const post = await getPostService(1)
    req.json(post)
})

routPost.get('/updatePost', async (res, req) => {
    const bool = await updatePostService('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 'Sono GAY 100kg', '100 kg di piselli', '6831fd415bf12cd21d4f1852')
    req.json(bool)
})


module.exports  = routPost