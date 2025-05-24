const { getAllGruppo, getGruppo, deleteGruppo, updateGruppoDescrizione, createGruppo} = require ('./GruppoDAO.js')

async function getAllGruppoService() {
    const gruppi = await getAllGruppo()
    return gruppi
}

async function getGruppoService(id_gruppo) {
    const gr = await getGruppo(id_gruppo)
    return gr
}

async function deleteGruppoService(id_gruppo) {
    const gr = await deleteGruppo(id_gruppo)
    return gr
}

async function updateGruppoDescrizioneService(id_gruppo, descrizione) {
    const bool = await updateGruppoDescrizione(id_gruppo, descrizione)
    return bool
}

async function createGruppoService(nick_gruppo, descrizione) {
    const bool = await createGruppo(nick_gruppo, descrizione)
    return bool
}

module.exports = {getAllGruppoService, getGruppoService, deleteGruppoService, updateGruppoDescrizioneService, createGruppoService}