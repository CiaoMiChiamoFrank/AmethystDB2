export const fetchNonce = async () => {
    try {
        const nonceResponse = await fetch("http://localhost:5000/getNonce"); // Cambia la porta se necessario
        if (!nonceResponse.ok) {
            throw new Error("Errore nel recupero del nonce");
        }
        const { nonce } = await nonceResponse.json();
        return nonce;
    } catch (error) {
        console.error("Errore durante il fetch del nonce:", error);
        throw error; // Rilancia l'errore per la gestione a livello superiore
    }
};
