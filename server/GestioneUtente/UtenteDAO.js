const mongoose = require ('../GestioneConnessione/dbConnection.js')
const UtenteSchema = new mongoose.Schema({
    id_metamask : {
        type : String,
        required : String,
        unique : String
    },
    nickname : {
        type : String,
        required : String,
        unique : String
    },
    biografia : {
        type : String
    }
})

const utente = mongoose.model('Utente', UtenteSchema, 'Utente')


//----------------------------------------READ--------------------------------------------------------------------------------
async function getAll() {
    const utenti = await utente.find()
    return utenti
}

async function getUtente(id_metamask) {
    const ut = await utente.findOne({id_metamask : id_metamask})
    if (ut != null) {
        return ut
    }
}
//---------------------------------------------------------------------------------------------------------------------------

//----------------------------------------UPDATE NICKNAME AND BIOGRAFIA-------------------------------------------------------
//ceck nickname if not exist
async function ceck_nickName(nickname) {
    const ut = await utente.findOne({nickname:nickname})
    if(ut == null){
        return true
    } else {
        return false
    } 
}

async function setNickName(nickname, id_metamask) {
    const ut = await utente.findOne( { id_metamask : id_metamask})
    if (ut){
        if( await ceck_nickName(nickname)) {
            ut.nickname = nickname
            await ut.save()
            return true
        }
    }
    return false
}

async function setBiografia(id_emtamask, biografia) {
    if(biografia.length <= 200) {
        const ut = await utente.findOne({id_metamask : id_emtamask})
        if (ut != null) {
            ut.biografia = biografia 
            await ut.save()
        }
        return ut
    }
}
//-------------------------------------------------------------------------------------------------------------

//------------------------------------------DELATE-------------------------------------------------------------
async function deleteAccount(id_metamask) {
    const ut = await utente.findOne({id_metamask : id_metamask})
    if(ut != null) {
        await utente.deleteOne({id_metamask : id_metamask})
        return true;
    } else {
        return false;
    }
}
//--------------------------------------------------------------------------------------------------------------

//-----------------------------------------INSERT ACCOUNT ------------------------------------------------------

async function ceck_metamask (id_emtamask) {
    const ut = await utente.findOne({id_metamask : id_emtamask})
    if (ut == null ){
        return true
    } else {
        return false
    }
}

//ceck nickname exist
async function ceck_metamask_exist (id_metamask){
    const ut = await utente.findOne({id_metamask : id_metamask})
    if (ut != null) {
        console.log('meta risposta', true)
        return true
    } else {
        console.log('meta risposta', false)
        return false
    }
}

async function createAccount(id_metamask, nickname) {
    if(id_metamask != null && nickname != null) {
        if (await ceck_nickName(nickname)) {
            if (await ceck_metamask(id_metamask)){
                await utente.create({
                id_metamask : id_metamask,
                nickname : nickname,
                biografia : ''
            })
            return true
            } 
        } 
    }
    return false
}

//------------------------------------------------------------------------------------------------------------

module.exports = {getAll, setNickName, setBiografia, getUtente, deleteAccount, createAccount, ceck_metamask_exist, ceck_nickName, ceck_metamask}