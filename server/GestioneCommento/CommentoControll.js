const {getCommentoService, updateCommentoService, deleteCommentoService, createCommentoService} = require ('./CommentoService')
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

module.exports = routCommento