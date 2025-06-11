const mongoose = require('../GestioneConnessione/dbConnection');
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
    },
    liked_by: {
        type: [String], // array di id_metamask
        default: []
    }

}, {
    timestamps: true
});

const post = mongoose.model('Post', postSchema, 'Post');
const {ceck_metamask_exist} = require ('../GestioneUtente/UtenteDAO');
const {addNumebrPost} = require ('../GestioneGruppo/GruppoDAO')
const {removeNumberPost, addLikeGruppo} = require ('../GestioneGruppo/GruppoDAO')

//-------------------------CREATE---------------------------------------------------------------

async function createPost (id_gruppo, id_metamask, title, descrizione, author, path) {
    if(await ceck_metamask_exist(id_metamask)) {
        if (descrizione.length <= 300 ) {
            if (title.length <= 65) {
                if (id_gruppo >= 0 && id_gruppo <= 10) {
                    const p = await post.create({
                        title : title,
                        author : author,
                        id_gruppo : id_gruppo,
                        id_metamask : id_metamask,
                        descrizione : descrizione,
                        n_like : 0,
                        path : path
                    });
                    try {
                        await addNumebrPost(id_gruppo)
                        console.log(`Numero di post incrementato per il gruppo ${id_gruppo}`);
                    } catch (error) {
                        console.error("Errore nell'aggiornamento del conteggio post del gruppo:", error);
                    }
                    return true;
                }
            }
        }
    }
    return false;
}

//-------------------------------DELATE-------------------------------------------------------------------

//ceck post exist
async function ceck_post (id_post) {
    const p = await post.findOne({_id : id_post});
    if(p != null) {
        console.log('post risposta', true)
        return true;
    } else {
        console.log('post risposta', false)
        return false;
    }
}

async function deletePost (id_post, id_metamask, id_gruppo) {
    if(await ceck_metamask_exist(id_metamask)) {
        if( await ceck_post(id_post)) {
            const p = await post.findOne({_id : id_post});
            if ( p.id_metamask == id_metamask){
                await post.deleteOne({ _id : id_post});
                // *** AGGIUNTA LOGICA: Decrementa il numero di post del gruppo ***
                try {
                    await removeNumberPost(id_gruppo)
                    console.log(`Numero di post decrementato per il gruppo ${p.id_gruppo}`);
                } catch (error) {
                    console.error("Errore nell'aggiornamento del conteggio post del gruppo dopo eliminazione:", error);
                }
                return true;
            }
        }
    }
    return false;
}

//-----------------------------------------------------------------------------------------------------------

//-------------------------------------READ-----------------------------------------------------------------

async function getPost (id_gruppo) {
    const p = await post.find( { id_gruppo : id_gruppo}).sort({ createdAt: -1 });
    return p;
}

//----------------------------------------------------------------------------------------------------------

//-------------------------------------UPDATE----------------------------------------------------------------

async function updatePost (id_metamask, title, descrizione, id_post) {
    if(await ceck_metamask_exist(id_metamask)) {
        const p = await post.findOne({_id : id_post});
        if(p != null) {
            if (p.id_metamask == id_metamask) {
                p.title = title;
                p.descrizione = descrizione;
                await p.save();
                return true;
            }
        }
    }
    return false;
}

async function addLike(id_post, id_metamask) {
    const p = await post.findOne({_id: id_post});
    if (p) {
        if (p.liked_by.includes(id_metamask)) {
            // Utente ha già messo like
            return false;
        }

        p.n_like = p.n_like + 1;
        p.liked_by.push(id_metamask);

        if (await addLikeGruppo(p.id_gruppo)) {
            await p.save();
            return true;
        }
    }
    return false;
}


//----------------------------------------------------------------------------------------------------------------

module.exports = {createPost, updatePost, getPost, deletePost, ceck_post, addLike};