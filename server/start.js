const express = require('express')
const app = express()
const routUtente = require('./GestioneUtente/UtenteControll')
const routGruppo = require('./GestioneGruppo/GruppoControll')
const routPost = require('./GestionePost/PostControll')
const routCommento = require ('./GestioneCommento/CommentoControll')

app.use(routUtente)
app.use(routGruppo)
app.use(routPost)
app.use(routCommento)

app.listen(5000)