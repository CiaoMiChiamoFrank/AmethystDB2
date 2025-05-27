import React, { useEffect, useState, useContext} from 'react';
import Header from './header';
import Footer from './footer';
import User from '../assets/user.png';
import { amethystABI } from '../AddressABI/amethystABI';
import { amethystAddress } from '../AddressABI/amethystAddress';
import {ethers} from 'ethers';
import { AccountContext } from '../context/AccountContext';
import { purplecoinABI } from '../AddressABI/purplecoinABI';
import { purplecoinAddress } from '../AddressABI/purplecoinAddress';
import { useAlert } from '../context/AlertContext';

function UserProfile() {
    const [nickname, setNickname] = useState("");
    const {account} = useContext(AccountContext);
    const [modalNickname, setModalNickname] = useState(""); // casella di testo del modal indipendente 
    const [isModalOpen, setIsModalOpen] = useState(false); // stato del modal per la visibilità

    const [biography, setBiography] = useState(""); // Stato per la biografia
    const [modalBiography, setModalBiography] = useState(""); // Stato per il modal della biografia
    const [isBioModalOpen, setIsBioModalOpen] = useState(false); // Stato per la visibilità del modal della biografia
    
    const [saldo, setBalance] = useState(null);
    
    const { showAlert } = useAlert();

    useEffect(() => {
    
        fetchUserData();
        
        fetchBiografy();

        fetchBalance();
    }, [])
    
    const fetchBalance = async() => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const purpleCoinContract = new ethers.Contract(purplecoinAddress, purplecoinABI, provider);
            
            const balance = await purpleCoinContract.balanceOf(account);
            console.log("Saldo utente:", balance);
            
            setBalance(balance);

        } catch (error) {
            console.log(error);
        }

    };

    const fetchUserData = async () => {
        try{
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(amethystAddress, amethystABI, provider);
            console.log("CONTRACT:", contract);
            
            const nicknamePromise = contract.get_nickname_address(account);

            const username = await nicknamePromise;
            console.log("Nome Utente:", username);
            setNickname(username)

            console.log("Indirizzo Utente:", account);
            
        }catch(error){
            console.log(error);
        }
    };

    const toggleModal = () => {
        setModalNickname(nickname); // inizializzalo con il niskname che c'è
        setIsModalOpen(!isModalOpen);
    };

    const modifyNick = async () => {
        console.log("NewName:", modalNickname); // modifica del nick

        try{
            const provider = new ethers.BrowserProvider(window.ethereum); // Usa il provider di Ethereum
            const signer = await provider.getSigner(account); // Usa l'account salvato nel context
            
            //facciamo un altro tipo di contratto con il signer perché questo lo usiamo per scrivere in blockchain con il signer
            const write_contract = new ethers.Contract(amethystAddress, amethystABI, signer);

            const tx = await write_contract.modifyNickname(modalNickname);
            console.log("Transazione inviata:", tx);
            await tx.wait(); // Aspetta il completamento della transazione
            console.log("Transazione completata:", tx);
            
            setNickname(modalNickname);

            showAlert("Nickname modificato con successo, complimenti!", "successo");


            toggleModal();
        }catch (error){
          showAlert("Errore durante la modifica del Nickname, riprova!", "errore");

            console.log(error);
        }
    };

    const toggleBioModal = () => {
        setModalBiography(biography); // inizializzalo con la biografia che c'è
        setIsBioModalOpen(!isBioModalOpen);
    };

    const modifyBio = async() => {

        try {
            console.log("NewBiography:", modalBiography); // stampa la nuova biografia

            const provider = new ethers.BrowserProvider(window.ethereum); // Usa il provider di Ethereum
            const signer = await provider.getSigner(account); // Usa l'account salvato nel context
            
            const write_contract = new ethers.Contract(amethystAddress, amethystABI, signer);

            const tx = await write_contract.addBiografia(modalBiography);

            console.log("Transazione inviata:", tx);
            await tx.wait(); // Aspetta il completamento della transazione
            console.log("Transazione completata:", tx);

            setBiography(modalBiography); // aggiorna lo stato della biografia

            showAlert("Biogragia aggiunta o modificata con successo, complimenti!", "successo");
            toggleBioModal();
        } catch (error) {

          showAlert("Errore durante la modifica o l'aggiunta di una biografia, riprova!", "errore");

            console.log(error);
        }
    };

    const fetchBiografy = async() => {

        try {

            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(amethystAddress, amethystABI, provider);
            console.log("contratto 2:", contract)
            const flag = contract.getBiografy(account);

            const bio = await flag;
            console.log("BIO in Blockchain:", bio);
            setBiography(bio)
        } catch (error) {
            console.log(error)
        }
    };


    return (
        <div className="font-pridi relative min-h-screen ">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-gray-200 to-purple-200 opacity-60 -z-10"></div>

          <Header />
      
        
            {/* Saldo Section */}
            <div className="flex justify-center mt-[70px]">
                <div className="flex flex-row items-center border-2 shadow-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 w-[400px] rounded-lg">
                <h3 className="font-bold text-lg mr-4">Saldo Corrente:</h3>
                <p className="text-xl font-semibold">{saldo} Purple Coin</p>
                </div>
            </div>
      
          {/* Main Grid Section */}
          <div className="md:grid grid-cols-4 grid-rows-2 bg-white gap-6 p-6 rounded-xl shadow-lg mt-10 mx-auto w-[90%] max-w-5xl  mb-20">
      
            {/* Profile Image Section */}
            <div className="md:col-span-1 h-48 shadow-md border-2 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50">
              <img
                src={User}
                className="w-36 h-36 rounded-full border-4 border-white"
                alt="Profile"
              />
            </div>
      
            {/* Profile Info Section */}
            <div className="md:col-span-3 shadow-md border-2 rounded-lg p-6 bg-gradient-to-r from-gray-50 to-gray-100 space-y-4">
              {/* Name Field */}
              <div className="flex items-center">
                <span className="text-sm bg-gray-200 font-bold uppercase border-2 rounded-l px-4 py-2 w-40 text-gray-700">
                  Name:
                </span>
                <input
                  className="px-4 bg-gray-100 border-gray-300 border-2 focus:outline-none rounded-md rounded-l-none shadow-sm w-full"
                  type="text"
                  value={nickname}
                  readOnly
                />
                <button
                  onClick={toggleModal}
                  className="bg-purple-600 text-white rounded-lg text-sm p-2 font-bold shadow-md hover:bg-purple-700 transition ml-4">
                  Modify Nickname
                </button>
              </div>
      
              {/* Address Field */}
              <div className="flex items-center">
                <span className="text-sm bg-gray-200 font-bold uppercase border-2 rounded-l px-4 py-2 w-40 text-gray-700">
                  Address:
                </span>
                <input
                  className="px-4 bg-gray-100 border-gray-300 border-2 focus:outline-none rounded-md rounded-l-none shadow-sm w-full"
                  type="text"
                  value={account}
                  readOnly
                />
              </div>
            </div>
      
            {/* Profile Description Section */}
            <div className="md:col-span-3 shadow-md border-2 rounded-lg p-6 bg-gradient-to-r from-gray-50 to-gray-100 mt-5">
              <h3 className="font-bold text-lg uppercase text-gray-700 mb-2">Profile Description</h3>
              <p className="text-gray-600">
                {biography || "Add your biography here..."}
              </p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={toggleBioModal}
                  className="bg-purple-600 text-white rounded-lg text-sm p-2 font-bold shadow-md hover:bg-purple-700 transition">
                  Add or Modify Biography
                </button>
              </div>
            </div>
          </div>
      
          {/* Nickname Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Modify Nickname</h2>
                <input
                  type="text"
                  className="w-full border-2 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Enter new nickname"
                  value={modalNickname}
                  onChange={(e) => setModalNickname(e.target.value)}
                />
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                    onClick={toggleModal}>
                    Cancel
                  </button>
                  <button
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    onClick={modifyNick}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
      
          {/* Biography Modal */}
          {isBioModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Modify Biography</h2>
                <textarea
                  className="w-full border-2 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Enter your biography"
                  value={modalBiography}
                  onChange={(e) => setModalBiography(e.target.value)}
                />
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                    onClick={toggleBioModal}>
                    Cancel
                  </button>
                  <button
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    onClick={modifyBio}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
      
          <Footer />
        </div>
      );
      
}

export default UserProfile;
