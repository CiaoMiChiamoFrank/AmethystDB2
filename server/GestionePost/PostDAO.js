const mongoose = require('../GestioneConnessione/dbConnection')
const postSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true
    }, 
    author : {
        type : String,
        required : true
    }, 
    id_gruppo : {
        type : Number,
        required : true
    }, 
    descrizione : {
        type : String,
        required : true
    },
    n_like : {
        type : Number
    },
    id_metamask : {
        type : String,
        required : true
    }, 
    path : {
        type : String
    }
})

const post = mongoose.model('Post', postSchema, 'Post')
const {ceck_metamask_exist} = require ('../GestioneUtente/UtenteDAO')

//-------------------------CREATE---------------------------------------------------------------

async function createPost (id_gruppo, id_metamask, title, descrizione, author, path) {
    if(await ceck_metamask_exist(id_metamask)) {
        if (descrizione.length <= 300 ) {
            if (title.length <= 65) {
                if (id_gruppo >=  0 && id_gruppo <= 10) {
                    const p = await post.create({
                        title : title,
                        author : author,
                        id_gruppo : id_gruppo,
                        id_metamask : id_metamask,
                        descrizione : descrizione,
                        n_like : 0,
                        path : path
                    })
                    await p.save()
                    return true
                }
            }
        }
    }
     return false 
}

//-------------------------------DELATE-------------------------------------------------------------------

//ceck post exist
async function ceck_post (id_post) {
    const p = await post.findOne({_id : id_post})
    if(p != null) {
        return true
    } else {
        return false
    }
}

async function deletePost (id_post, id_metamask) {
    if(await ceck_metamask_exist(id_metamask)) {
        if( await ceck_post(id_post)) {
            const p = await post.findOne({_id : id_post})
            if ( p.id_metamask == id_metamask){
                await post.deleteOne({ _id : id_post})
                return true
            }
        }
    }
    return false
}

//-----------------------------------------------------------------------------------------------------------

//-------------------------------------READ-----------------------------------------------------------------

async function getPost (id_gruppo) {
    const p = await post.find( { id_gruppo : id_gruppo})
    return p
}

//----------------------------------------------------------------------------------------------------------

//-------------------------------------UPDATE----------------------------------------------------------------

async function updatePost (id_metamask, title, descrizione, id_post) {
    if(await ceck_metamask_exist(id_metamask)) {
        const p = await post.findOne({_id : id_post})
        if(p != null) {
            if (p.id_metamask == id_metamask) {
                p.title = title
                p.descrizione = descrizione
                p.save()
                return true
            }
        }
    }
    return false
}

//----------------------------------------------------------------------------------------------------------------


module.exports = {createPost, updatePost, getPost, deletePost, ceck_post}