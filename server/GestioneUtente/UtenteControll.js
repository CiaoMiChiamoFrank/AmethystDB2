const express = require('express')
const routUtente = express.Router()
const {getAllService, setNickNameService, setBiografiaService, getUtenteService, deleteAccountService, createAccountService} = require('./UtenteService')

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

routUtente.get('/create', async (res, req) => {
    const utenti = await createAccountService('0xdD2FD4581271e230360230F9337D5c0430Bf44C0', 'Ledge')
    req.json(utenti)
})

module.exports = routUtente