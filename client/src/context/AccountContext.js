import React, { createContext, useState, useEffect} from 'react';

// Crea il contesto
export const AccountContext = createContext();

// Provider per il contesto
export const AccountProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [isRegistered, setRegistered] = useState(null);
    
    //per fare in modo che il valore di online o no, resista anche al refresh della pagina
    const [isOnline, setIsOnline] = useState(() => {
        return localStorage.getItem("isOnline") === "true";
    });

    useEffect(() => {
        localStorage.setItem("isOnline", isOnline.toString());
    }, [isOnline]);

    return (
        <AccountContext.Provider value={{ account, setAccount, isRegistered, setRegistered, isOnline, setIsOnline }}>
            {children}
        </AccountContext.Provider>
    );
};
