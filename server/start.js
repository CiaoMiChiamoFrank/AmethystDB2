const express = require('express')
const app = express()
const routUtente = require('./GestioneUtente/UtenteControll')
const routGruppo = require('./GestioneGruppo/GruppoControll')

app.use(routUtente)
app.use(routGruppo)

app.listen(5000)