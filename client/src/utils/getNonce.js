import React, { useState } from "react";
import axios from "axios";

function GetNonce() {
    const [nonce, setNonce] = useState("");

    const fetchNonce = async () => {
        try {
            const response = await axios.get("/auth/getNonce");
            setNonce(response.data.nonce);
        } catch (error) {
            console.error("Error fetching nonce:", error);
        }
    };

    return (
        <div>
            <h1>Nonce Authentication</h1>
            <button onClick={fetchNonce}>Get Nonce</button>
            {nonce && <p>Nonce: {nonce}</p>}
        </div>
    );
}

export default GetNonce;
