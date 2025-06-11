import React, { useEffect, useState, useContext } from 'react';
import Header from './header';
import Footer from './footer';
import User from '../assets/user.png';
import { ethers } from 'ethers';
import { AccountContext } from '../context/AccountContext';
import { purplecoinABI } from '../AddressABI/purplecoinABI';
import { purplecoinAddress } from '../AddressABI/purplecoinAddress';
import { useAlert } from '../context/AlertContext';

function UserProfile() {
    const [nickname, setNickname] = useState("");
    const { account } = useContext(AccountContext);
    const [modalNickname, setModalNickname] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [biography, setBiography] = useState("");
    const [modalBiography, setModalBiography] = useState("");
    const [isBioModalOpen, setIsBioModalOpen] = useState(false);

    const [saldo, setBalance] = useState(null);

    const { showAlert } = useAlert();

    useEffect(() => {
        fetchUserData();
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const purpleCoinContract = new ethers.Contract(purplecoinAddress, purplecoinABI, provider);
            const balance = await purpleCoinContract.balanceOf(account);
            setBalance(balance);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUserData = async () => {
        try {
            const res = await fetch(`http://localhost:5000/Utente/getAccount/${account}`);
            const utente = await res.json();
            setNickname(utente.nickname);
            setBiography(utente.biografia);
        } catch (error) {
            console.log(error);
        }
    };

    const toggleModal = () => {
        setModalNickname(nickname);
        setIsModalOpen(!isModalOpen);
    };

    const toggleBioModal = () => {
        setModalBiography(biography);
        setIsBioModalOpen(!isBioModalOpen);
    };

    const modifyNick = async () => {
        try {
            const response = await fetch("http://localhost:5000/Utente/modificanick", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    account: account,
                    nickname: modalNickname,
                }),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setNickname(modalNickname);
                showAlert("Nickname modificato con successo!", "successo");
                toggleModal();
            } else {
                showAlert("Errore durante la modifica del Nickname!", "errore");
            }
        } catch (error) {
            console.log(error);
            showAlert("Errore durante la comunicazione con il server!", "errore");
        }
    };

    const modifyBio = async () => {
        try {
            const response = await fetch("http://localhost:5000/Utente/modificabio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    account: account,
                    biografia: modalBiography,
                }),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setBiography(modalBiography);
                showAlert("Biografia modificata con successo!", "successo");
                toggleBioModal();
            } else {
                showAlert("Errore durante la modifica della biografia!", "errore");
            }
        } catch (error) {
            console.log(error);
            showAlert("Errore durante la comunicazione con il server!", "errore");
        }
    };

    return (
        <div className="font-pridi relative min-h-screen ">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-gray-200 to-purple-200 opacity-60 -z-10"></div>
            <Header />

            <div className="flex justify-center mt-[70px]">
                <div className="flex flex-row items-center border-2 shadow-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 w-[400px] rounded-lg">
                    <h3 className="font-bold text-lg mr-4">Saldo Corrente:</h3>
                    <p className="text-xl font-semibold">{saldo} Purple Coin</p>
                </div>
            </div>

            <div className="md:grid grid-cols-4 grid-rows-2 bg-white gap-6 p-6 rounded-xl shadow-lg mt-10 mx-auto w-[90%] max-w-5xl mb-20">
                <div className="md:col-span-1 h-48 shadow-md border-2 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50">
                    <img
                        src={User}
                        className="w-36 h-36 rounded-full border-4 border-white"
                        alt="Profile"
                    />
                </div>

                <div className="md:col-span-3 shadow-md border-2 rounded-lg p-6 bg-gradient-to-r from-gray-50 to-gray-100 space-y-4">
                    <div className="flex items-center">
                        <span className="text-sm bg-gray-200 font-bold uppercase border-2 rounded-l px-4 py-2 w-40 text-gray-700">Name:</span>
                        <input
                            className="px-4 bg-gray-100 border-gray-300 border-2 focus:outline-none rounded-md rounded-l-none shadow-sm w-full"
                            type="text"
                            value={nickname}
                            readOnly
                        />
                        <button
                            onClick={toggleModal}
                            className="bg-purple-600 text-white rounded-lg text-sm p-2 font-bold shadow-md hover:bg-purple-700 transition ml-4"
                        >
                            Modify Nickname
                        </button>
                    </div>

                    <div className="flex items-center">
                        <span className="text-sm bg-gray-200 font-bold uppercase border-2 rounded-l px-4 py-2 w-40 text-gray-700">Address:</span>
                        <input
                            className="px-4 bg-gray-100 border-gray-300 border-2 focus:outline-none rounded-md rounded-l-none shadow-sm w-full"
                            type="text"
                            value={account}
                            readOnly
                        />
                    </div>
                </div>

                <div className="md:col-span-3 shadow-md border-2 rounded-lg p-6 bg-gradient-to-r from-gray-50 to-gray-100 mt-5">
                    <h3 className="font-bold text-lg uppercase text-gray-700 mb-2">Profile Description</h3>
                    <p className="text-gray-600">{biography || "Add your biography here..."}</p>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={toggleBioModal}
                            className="bg-purple-600 text-white rounded-lg text-sm p-2 font-bold shadow-md hover:bg-purple-700 transition"
                        >
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
                            <button className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400" onClick={toggleModal}>
                                Cancel
                            </button>
                            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700" onClick={modifyNick}>
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
                            <button className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400" onClick={toggleBioModal}>
                                Cancel
                            </button>
                            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700" onClick={modifyBio}>
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
