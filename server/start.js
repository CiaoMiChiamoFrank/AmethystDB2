const express = require("express");
const cors = require("cors");
const { recoverPersonalSignature } = require("eth-sig-util");
const { bufferToHex } = require("ethereumjs-util");
require("dotenv").config();

const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;

const SECRET_KEY = process.env.JWT_SECRET;

const routUtente = require('./GestioneUtente/UtenteControll')
const routGruppo = require('./GestioneGruppo/GruppoControll')
const routPost = require('./GestionePost/PostControll')
const routCommento = require ('./GestioneCommento/CommentoControll')


// Verifica che la Secret Key sia configurata
if (!SECRET_KEY) {
    console.error("Errore: JWT_SECRET non configurata nel file .env");
    process.exit(1); 
}

// Array per memorizzare i nonce generati
const released_nonce = [];
const users = [];

app.use(cors());
app.use(express.json());

// per verificare che il server funzioni
app.get("/test", (req, res) => {
    res.send("Server is working!");
});

// Endpoint per generare un nonce univoco
app.get("/getNonce", (req, res) => {
    const nonce = `Authenticated request ${Date.now()}`;
    released_nonce.push(nonce);
    res.json({ nonce });
});

// Endpoint per verificare che il nonce sia firmato correttament
app.post("/verify", (req, res) => {

    console.log("Secret Key: ", SECRET_KEY)

    console.log("Richiesta ricevuta per la verifica");

    const { account, signature, nonce } = req.body;

    console.log("Dati ricevuti:", { account, signature, nonce });

    // Controlla se il nonce è valido
    const index = released_nonce.indexOf(nonce);
    if (index > -1) {
        released_nonce.splice(index, 1); // Rimuove il nonce per impedirne il riutilizzo
    } else {
        res.status(401).json({ success: false, error: "Invalid nonce" });
        return;
    }

    // Converte il nonce in formato richiesto per la firma
    const msgBufferHex = bufferToHex(Buffer.from(nonce, "utf8"));

    // Recupera l'indirizzo dalla firma
    const recoveredAddress = recoverPersonalSignature({
        data: msgBufferHex,
        sig: signature,
    });

    console.log("Indirizzo recuperato dalla firma:", recoveredAddress);

    // Confronta l'indirizzo recuperato con quello fornito
    if (recoveredAddress.toLowerCase() === account.toLowerCase()) {
        // Genera il token JWT
        const token = jwt.sign({ account }, SECRET_KEY, { expiresIn: "1h" });
        console.log("Token generato:", token);
        
        // Ritorna il token al client
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, error: "Invalid signature" });
    }
});

function verifyToken(req, res, next) {
    // Estrae il token dagli header
    const token = req.headers.authorization?.split(" ")[1]; // Gli header contengono "Bearer <token>"
    console.log("Headers ricevuti:", req.headers);

    if (!token) {
        console.error("Token non trovato.");
        return res.status(401).json({ success: false, error: "Access denied. Token missing." });
    }

    // Verifica il token
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error("Errore durante la verifica del token:", err);
            return res.status(401).json({ success: false, error: "Access denied. Invalid token." });
        }

        console.log("Token decodificato:", decoded);

        
        req.account = decoded.account;

        // Passa il controllo al prossimo middleware o route handler
        next();
    });
}

app.get("/dashboard", verifyToken, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to your dashboard!",
        account: req.account, // L'account è stato aggiunto dal middleware
    });
});

app.post("/logout", (req, res) => {
    // Non c'è molto da fare nel backend con JWT
    // JWT è senza stato, quindi il logout avviene rimuovendo il token dal client
    res.json({ success: true, message: "Logout effettuato correttamente." });
});

// Route di registrazione
app.post("/register", (req, res) => {
    const { account, signature, nonce } = req.body;
  
    // Verifica se l'account esiste già nel sistema
    if (users[account]) {
      return res.status(400).json({ success: false, error: "Account già esistente" });
    }
  
    // Verifica la firma ricevuta
    const msgBufferHex = bufferToHex(Buffer.from(nonce, "utf8"));
    const recoveredAddress = recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });
  
    if (recoveredAddress.toLowerCase() === account.toLowerCase()) {
      // Salva l'utente nel sistema (qui lo memorizziamo nell'oggetto `users`)
      users[account] = { account };
  
      // Genera un JWT per l'utente
      const token = jwt.sign({ account }, SECRET_KEY, { expiresIn: "1h" });
  
      return res.json({
        success: true,
        message: "Registrazione avvenuta con successo",
        token,
      });
    } else {
      return res.status(401).json({ success: false, error: "Firma non valida" });
    }
  });

app.use('/Utente',routUtente)
app.use(routGruppo)
app.use(routPost)
app.use(routCommento)

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
