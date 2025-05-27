import React, { useState, useEffect, useContext } from 'react';
import Header from './header';
import Footer from './footer';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../context/AccountContext';
import { ethers } from 'ethers';
import { amethystABI } from '../AddressABI/amethystABI';
import { amethystAddress } from '../AddressABI/amethystAddress';
import { useAlert } from '../context/AlertContext';

function Signup() {
  const navigate = useNavigate(); 
  const { account, isRegistered } = useContext(AccountContext);
  const [nickname, setNickname] = useState('');
  const [contract, setContract] = useState(null);
  const { showAlert } = useAlert();

  // Recupera nickname salvato su localStorage
  useEffect(() => {
    const savedNickname = localStorage.getItem('nickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  // Salva nickname ogni volta che cambia
  useEffect(() => {
    localStorage.setItem('nickname', nickname);
  }, [nickname]);

  // Recupera account da MetaMask se non ancora caricato
  useEffect(() => {
    const getAccount = async () => {
      if (!account && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts.length > 0) {
            console.log("Account ottenuto da MetaMask:", accounts[0]);
            // Se necessario, aggiorna manualmente il context qui
          }
        } catch (err) {
          console.error("Errore nel recupero dell'account:", err);
        }
      }
    };
    getAccount();
  }, [account]);

  // Inizializza il contratto
  useEffect(() => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const smart = new ethers.Contract(amethystAddress, amethystABI, provider);
    setContract(smart);
  }, []);

  const sendDataNick = async (e) => {
    e.preventDefault(); 
    if (!account) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(account);
      const flag_contract = new ethers.Contract(amethystAddress, amethystABI, signer);

      // Chiamata al backend per registrazione
      const response = await fetch('http://localhost:5000/Utente/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname, account: account }),
      });

      const data = await response.json();
      const { metabool2, nickbool1, bool, utente } = data;

      if (!nickbool1 && metabool2) {
        showAlert('Nickname esistente.', "errore");
        return;
      } else if (!metabool2 && nickbool1) {
        showAlert('Address metamask esistente, effettua il login.', "errore");
        const tx = await flag_contract.create_account(account, utente.nickname);
        await tx.wait();
        const flag = await contract.get_utente_registrato(account);
        if (flag) {
          localStorage.removeItem('nickname');
          navigate('/login');
        }
        return;
      }

      // Chiamata a smart contract
      const tx = await flag_contract.create_account(account, nickname);
      await tx.wait();
      const flag = await contract.get_utente_registrato(account);

      if (flag) {
        localStorage.removeItem('nickname');
        showAlert("Registrazione Riuscita, ora puoi effettuare il login!", "successo");
        navigate('/login');
      } else {
        showAlert("Errore durante la registrazione, riprova!", "errore");
      }

    } catch (error) {
      showAlert('Address metamask esistente, effettua il login.', "errore");
      if (error.reason) {
        console.log("Messaggio errore Solidity:", error.reason);
      } else {
        console.log("Errore completo:", error);
      }
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="font-pridi bg-gradient-to-r from-purple-300 via-indigo-200 to-blue-300">
      <Header/>
      <div className="relative min-h-screen flex flex-col sm:justify-center items-center">
        <div className="relative sm:max-w-sm w-full">
          <div className="card bg-purple-500 shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6"></div>
          <div className="card bg-orange-500 shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"></div>
          <div className="relative w-full rounded-3xl px-6 py-4 bg-gray-100 shadow-md">
            <label className="block text-xl mt-3 text-purple-700 text-center font-bold border-2 border-slate-300">
              Signup with MetaMask
            </label>
            <form method="#" action="#" className="mt-10">
              <div>
                <input
                  type="text" 
                  placeholder="Nickame"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="mt-1 p-5 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 duration-500 "
                />
              </div>

              <div className="mt-7">
                <button
                  type="submit"
                  onClick={sendDataNick}
                  className="bg-orange-400 w-full py-3 rounded-xl text-white shadow-xl focus:outline-none transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105 hover:shadow-sm"
                >
                  Signup
                </button>
              </div>

              <div className="mt-7">
                <div className="flex justify-center items-center">
                  <a className="underline text-sm text-gray-600 hover:text-gray-900 duration-500 cursor-pointer hover:scale-105" onClick={handleLogin}>
                    Sei già registrato con MetaMask?
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Signup;
