const mongoose = require('../GestioneConnessione/dbConnection')
const gruppoSchema = new mongoose.Schema({
    nick_gruppo : {
        type : String,
        required : String,
        unique : true
    },
    descrizione : {
        type : String
    },
    n_like : {
        type : Number
    },
    n_post : {
        type : Number
    },
     id_gruppo: {
        type: Number,
        required: true,
        unique: true,
        min: 1,
        max: 10,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} non è un numero intero valido.'
        }
    }
})

const gruppo = mongoose.model('Gruppo', gruppoSchema, 'Gruppo')

//------------------------------READ--------------------------------------------------------------------------
async function getAllGruppo() {
    const gr = await gruppo.find()
    return gr
}

async function getGruppo(id_gruppo) {
    const gr = await gruppo.findOne({id_gruppo : id_gruppo})
    if (gr != null){
        return gr
    }
}

//-------------------------------------------------------------------------------------------------------------

//------------------------------DELATE------------------------------------------------------------------------
async function check_gruppo (id_gruppo) {
    const gr = await gruppo.findOne({id_gruppo : id_gruppo})
    if (gr != null) {
        return true
    } else {
        return false
    }
}

async function deleteGruppo(id_gruppo) {
    if( await check_gruppo(id_gruppo)) {
        await gruppo.deleteOne({id_gruppo:id_gruppo})
        return true
    } else {
        return false
    }
}

//-----------------------------------------------------------------------------------------------------------

//--------------------------------UPDATE---------------------------------------------------------------------
async function updateGruppoDescrizione(id_gruppo, descrizione) {
    if(await check_gruppo(id_gruppo)) {
        const gr = await gruppo.findOne({id_gruppo:id_gruppo})
        if (descrizione.length <= 200) {
            gr.descrizione = descrizione
            await gr.save()
            return true
        } else {
            return false 
        }
    }
}
//------------------------------------------------------------------------------------------------------------


//-------------------------------CREATE-----------------------------------------------------------------------

async function check_nickGruppo(nick_gruppo) {
    const gr = await gruppo.findOne({nick_gruppo : nick_gruppo})
    if(gr == null) {
        return true
    } else { 
        return false
    }
}

async function createGruppo(nick_gruppo, descrizione) {
    const numebr = await gruppo.findOne().sort({ _id: -1}).limit(1)
    if (await check_nickGruppo(nick_gruppo)) {
        if(descrizione. length <= 200){
            await gruppo.create({
                id_gruppo : numebr.id_gruppo + 1,
                nick_gruppo : nick_gruppo,
                descrizione : descrizione,
                n_like : 0,
                n_post : 0
            })
        }
        return true
    } 
    return false
}

//-------------------------------------------------------------------------------------------------------------

module.exports = { getAllGruppo, getGruppo, deleteGruppo, updateGruppoDescrizione, createGruppo}