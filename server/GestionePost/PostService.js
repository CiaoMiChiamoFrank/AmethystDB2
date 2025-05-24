const {createPost, updatePost, getPost, deletePost} = require ('./PostDAO.js')

async function createPostService(id_gruppo, id_metamask, title, descrizione, author, path) {
    const bool = await createPost(id_gruppo, id_metamask, title, descrizione, author, path)
    return bool
}

async function updatePostService(id_metamask, tile, descrizione, id_post) {
    const bool =  await updatePost(id_metamask, tile, descrizione, id_post)
    return bool
}

async function getPostService(id_gruppo) {
    const post = await getPost(id_gruppo)
    return post
}

async function deletePostService(id_post, id_metamask) {
    const bool = await deletePost(id_post, id_metamask)
    return bool
}

module.exports = {createPostService, updatePostService, getPostService, deletePostService}