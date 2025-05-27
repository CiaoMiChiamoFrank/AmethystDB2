const express = require('express')
const routUtente = express.Router()
const cors = require ('cors')
const {getAllService, setNickNameService, setBiografiaService, getUtenteService, deleteAccountService, createAccountService, ceckUtenteService} = require('./UtenteService')

 routUtente.get('/', async (res, req) => {
    const utenti = await getUtenteService()
    req.json(utenti)
})

routUtente.get('/modificabio', async (res, req) => {
    const utenti = await setBiografiaService()
    req.json(utenti)
})

routUtente.get('/delete', async (res, req) => {
    const utenti = await deleteAccountService('0xdD2FD4581271e230360230F9337D5c0430Bf44C0')
    req.json(utenti)
})

// Route POST per ricevere dati da frontend
routUtente.post('/signup', async (req, res) => {
    // I dati inviati dal frontend (nickname e account) sono disponibili in req.body
    const { nickname } = req.body
    const account = req.body.account.toUpperCase(); // Conversione in uppercase

    console.log('Dati ricevuti:');
    console.log('nickname:', nickname);
    console.log('account:', account);

    const bool = await createAccountService(account, nickname);
    if (bool == false) {
        const {nickbool1, metabool2} = await ceckUtenteService(nickname, account)
        const utente = await getUtenteService(account)
        res.status(200).json({message: 'Dati ricevuti correttamente dal server Express', metabool2, nickbool1, bool, utente});
    } else {
        res.status(200).json({message: 'Dati ricevuti correttamente dal server Express', bool});
    }
});


module.exports = routUtente