const {getCommento, updateCommento, deleteCommento, createCommento, getCommentiByPostId} = require('./CommentoDAO')

async function getCommentoService(id_post) {
    const com = await getCommento(id_post)
    return com
}

async function updateCommentoService(id_commento, descrizione, id_metamask) {
    const bool = await updateCommento(id_commento, descrizione, id_metamask)
    return bool
}

async function deleteCommentoService(id_commento, id_metamask) {
    const bool = await deleteCommento(id_commento, id_metamask)
    return bool
}

async function createCommentoService (id_post, descrizione, id_metamask, nick_name) {
    const bool = await createCommento(id_post, descrizione, id_metamask, nick_name)
    return bool
}

async function getCommentiService(id_post) {
  return getCommentiByPostId(id_post);
}


module.exports = {getCommentoService, updateCommentoService, deleteCommentoService, createCommentoService, getCommentiService}
