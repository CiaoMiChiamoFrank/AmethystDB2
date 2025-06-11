const {getCommentoService, updateCommentoService, deleteCommentoService, createCommentoService, getCommentiService} = require ('./CommentoService')
const express = require ('express')
const routCommento = express.Router()

routCommento.get('/createCommento', async (res, req) => {
    const bool = await createCommentoService('6831f30007f435953e799249', 'pippo e popolino', '0x71bE63f3384f5fb98995898A86B02Fb2426c5788')
    req.json(bool)
})

routCommento.get('/getCommento', async (res, req) => {
    const commento = await getCommentoService('6831f30007f435953e799249')
    req.json(commento)
})

routCommento.get('/updateCommento', async (res, req) => {
    const bool = await updateCommentoService('68320a650fc8f5f9492dc4ce', 'bingo bongo bango', '0x71bE63f3384f5fb98995898A86B02Fb2426c5788')
    req.json(bool)
})

routCommento.get('/deleteCommento', async (res, req) => {
    const bool = await deleteCommentoService('68320a650fc8f5f9492dc4ce', '0x71bE63f3384f5fb98995898A86B02Fb2426c5788')
    req.json(bool)
})

routCommento.post('/createCommento', async (req, res) =>{
    const { id_post, id_metamask, autore, contenuto} = req.body
    const metamaskUpper = id_metamask.toUpperCase();

    console.log('id_post', id_post + '\nid meta', metamaskUpper + '\nautore', autore + '\ncontenuto', contenuto)

    try {
        const success = await createCommentoService(id_post, contenuto, metamaskUpper, autore)
        console.log('risposta', success) 

        if (success) {
            res.status(200).json({ message: "Commento aggiunto con successo" });
        } else {
            res.status(400).json({ error: "Commento già presente o errore logico" });
        }
    } catch (err) {
        console.error("Errore in addCommento:", err);
        res.status(500).json({ error: "Errore interno del server" });
    }
}) 

routCommento.get('/getCommentiByPostId/:id_post', async (req, res) => {
  try {
    const commenti = await getCommentiService(req.params.id_post);
    res.status(200).json(commenti);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore server", error: err });
  }
});

module.exports = routCommento