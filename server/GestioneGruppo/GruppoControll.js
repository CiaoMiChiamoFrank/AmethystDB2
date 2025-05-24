const express = require('express')
const routGruppo = express.Router()
const {getAllGruppoService, getGruppoService, deleteGruppoService, updateGruppoDescrizioneService, createGruppoService} = require('./GruppoService')

routGruppo.get('/getGruppoAll', async (res, req) => {
    const gr = await getAllGruppoService()
    req.json(gr)
})

routGruppo.get('/getGruppo', async (res, req) => {
    const gr = await getGruppoService(1)
    req.json(gr)
})

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