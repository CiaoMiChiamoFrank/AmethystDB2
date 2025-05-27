const {getAll, setNickName, setBiografia, getUtente, deleteAccount, createAccount, ceck_metamask_exist, ceck_nickName, ceck_metamask} = require("./UtenteDAO");

async function getAllService() {
    const utenti = await getAll()
    return utenti
}

async function getUtenteService(id_metamask) {
    const ut = await getUtente(id_metamask)
    return ut
}


async function setNickNameService (nickname, id_metamask) {
    const ut = await setNickName(nickname, id_metamask)
    return ut
}

async function setBiografiaService(id_emtamask, biografia) {
    const ut = await setBiografia(id_emtamask, biografia)
    return ut
}

async function deleteAccountService(id_metamask) {
    const bool = await deleteAccount(id_metamask)
    return bool 
}

async function ceckUtenteService(nickname, id_metamask) {
    const nickbool1 = await ceck_nickName(nickname)
    const metabool2 = await ceck_metamask(id_metamask)
    console.log(nickbool1, metabool2)
    return {nickbool1, metabool2}
}


async function createAccountService(id_metamask, nickname) {
    const bool = await createAccount(id_metamask, nickname)
    return bool
}

module.exports = {getAllService, setNickNameService, setBiografiaService, getUtenteService, deleteAccountService, createAccountService, ceckUtenteService}