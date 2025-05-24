const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/Amethyst').then('Connessione avvenuta con successo')

module.exports = mongoose