const express = require('express')
const routGruppo = express.Router()
const {getAllGruppoService, getGruppoService, deleteGruppoService, updateGruppoDescrizioneService, createGruppoService} = require('./GruppoService')

routGruppo.get('/getGruppoAll', async (req, res) => {
    try {
        const gr = await getAllGruppoService();
        res.json(gr);
        console.log(gr)
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero dei gruppi' });
    }
});

routGruppo.get('/getGruppo/:id', async (req, res) => {
  try {
    const idGruppo = req.params.id;
    const gr = await getGruppoService(idGruppo);
    res.json(gr); 
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero del gruppo' });
  }
});

routGruppo.get('/deleteGruppo', async (res, req) => {
    const gr = await deleteGruppoService(4)
    req.json(gr)
})

routGruppo.get('/descrizioneGruppo', async (res, req) => {
    const gr = await updateGruppoDescrizioneService(4, 'wowowowowowoowowow')
    req.json(gr)
})

routGruppo.get('/createGruppo', async (res, req) => {
    const gr = await createGruppoService('sborra', 'wowowowowowoowowow')
    req.json(gr)
})


module.exports = routGruppo