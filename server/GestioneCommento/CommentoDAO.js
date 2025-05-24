const mongoose = require('../GestioneConnessione/dbConnection')
const commentoSchema = new mongoose.Schema ({
    id_post: {
        type: mongoose.Schema.Types.ObjectId, // Questo indica che è un ObjectId di un altro documento
        ref: 'Post',                        // Questo specifica a quale modello si riferisce
        required: true                      // Probabilmente vuoi che ogni commento sia associato a un post
    },
    descrizione : {
        type : String,
        required : true
    },
    id_metamask : {
        type : String,
        require : true
    }
})

const commento = mongoose.model('Commento', commentoSchema, 'Commento')
const {ceck_post} = require('../GestionePost/PostDAO')
const {ceck_metamask_exist} = require('../GestioneUtente/UtenteDAO')

//------------------------------------CREATE------------------------------------------------------
async function createCommento(id_post, descrizione, id_metamask) {
    if(await ceck_post(id_post)) {
        if (await ceck_metamask_exist(id_metamask)) {
            if (descrizione. length <= 255) {
                const com = await commento.create({
                    id_post : id_post,
                    descrizione : descrizione,
                    id_metamask : id_metamask
                })
                await com.save()
                return true
            }
        }
    }
    return false
}
//------------------------------------------------------------------------------------------------

//----------------------DELATE--------------------------------------------------------------------
async function deleteCommento(id_commento, id_metamask) {
    if(await ceck_metamask_exist(id_metamask)){
        const com = await commento.findOne({_id : id_commento})
        if(com.id_metamask == id_metamask){
            await commento.deleteOne({_id : id_commento})
            return true
        }
    }
    return false
}

//-------------------------------------------------------------------------------------------------

//------------------------READ---------------------------------------------------------------------
async function getCommento(id_post) {
    const com = await commento.find({id_post : id_post})
    if(com != null){
        return com
    }
}
//-------------------------------------------------------------------------------------------------

//----------------------UPDATE---------------------------------------------------------------------
async function updateCommento(id_commento, descrizione, id_metamask) {
    const com = await commento.findOne({_id : id_commento})
    if (com != null) {
        if (ceck_metamask_exist(id_metamask)){
            if ( com.id_metamask == id_metamask) {
                com.descrizione = descrizione
                await com.save()
                return true
            }
        }
    }
    return false
}
//--------------------------------------------------------------------------------------------------


module.exports = {getCommento, updateCommento, deleteCommento, createCommento}