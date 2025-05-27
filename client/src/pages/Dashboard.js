import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { amethystAddress } from '../AddressABI/amethystAddress';
import { amethystABI } from '../AddressABI/amethystABI';
import Header from './header';
import Footer from './footer';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from "../context/AccountContext";

const Dashboard = () => {
  const [gruppi, setGruppi] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const navigate = useNavigate();
  const { isOnline } = useContext(AccountContext);

  useEffect(() => {
    console.log("SEI ONLINE?", isOnline);

    const fetchGruppi = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(amethystAddress, amethystABI, signer);

        const gruppiData = await contract.getGruppi();
        setGruppi(gruppiData);

        /*for (let i = 0; i < gruppiData.length; i++) {
          console.log("Nick name gruppo:", gruppiData[i].nick_group);
        }*/
      } catch (error) {
        console.error("Errore nel recupero dei gruppi:", error);
      }
    };

    fetchGruppi();
  }, []);

  const handleGroupClick = (groupId) => {
    const groupIdNumber = Number(groupId); 
    console.log("ID gruppo selezionato:", groupIdNumber);
    navigate("/gruppo", { state: { groupId: groupIdNumber } });
  };

  return (
  <div className="relative min-h-screen">
  <div className="absolute inset-0 bg-gradient-to-b from-purple-200 via-blue-200 to-gray-400 opacity-60 -z-10"></div>

  <Header />
  <div className="container mx-auto py-10 mt-10 px-6 sm:px-10">
    {/* Titolo */}
    <div className="border-2 border-purple-400 mt-10 mb-10 flex items-center justify-center p-5 h-auto rounded-xl shadow-lg bg-gradient-to-r from-purple-200 via-white to-purple-100">
      <h1 className="text-4xl font-extrabold text-center font-pridi text-transparent bg-clip-text bg-gradient-to-b from-purple-700 to-blue-500">
        Gruppi creati dalla community
      </h1>
    </div>

    {/* Cards dei gruppi */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {gruppi.length > 0 ? (
        gruppi.map((gruppo, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
            onClick={() => handleGroupClick(gruppo.id_gruppo)}
          >
            {/* Immagine */}
            <img
              src={require(`./img/${gruppo.nick_group}.jpg`)}
              alt={`${gruppo.nick_group}`}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Contenuto della card */}
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                {gruppo.nick_group}
              </h2>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                {gruppo.descrizione}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-gray-700 text-sm">
                  Likes: <strong>{gruppo.n_like}</strong>
                </span>
                <span className="text-gray-700 text-sm">
                  Post: <strong>{gruppo.n_post}</strong>
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center text-lg">
          Nessun gruppo disponibile
        </p>
      )}
    </div>
  </div>
  <Footer />
</div>

  );
};

export default Dashboard;
