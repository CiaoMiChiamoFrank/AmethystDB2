import React, { useState, useEffect, useContext } from "react";
import { ethers, id } from "ethers";
import { amethystAddress } from "../AddressABI/amethystAddress";
import { amethystABI } from "../AddressABI/amethystABI";
import Header from "./header";
import Footer from "./footer";
import { useLocation } from "react-router-dom";
import sfondo from "../assets/cavern_amethyst.png";
import { AccountContext } from '../context/AccountContext';
import { useAlert } from '../context/AlertContext';

const GruppoPage = () => {
  const {account} = useContext(AccountContext);
  const [groupInfo, setGroupInfo] = useState({});
  const [utenteInfo, setUtenteInfo] = useState("");
  const [commentoInfo, setCommentoInfo] = useState({});
  const location = useLocation();
  const { groupId } = location.state || {};
  const [descrizione, setDescrizione] = useState("");
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null); // Traccia il post selezionato per il commento
  const [commentText, setCommentText] = useState(""); // Testo del commento
  const [nome, setNome] = useState(null);

  const { showAlert } = useAlert();
  
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(amethystAddress, amethystABI, signer);
  
        // Recupera i dati del gruppo
        const groupData = await contract.getGruppId(groupId);
        setGroupInfo({
          nick_group: groupData.nick_group,
          n_like: groupData.n_like,
          n_post: groupData.n_post,
          descrizione: groupData.descrizione || "Nessuna descrizione disponibile"
        });

        setNome(groupData.nick_group)
  
        // Recupera l'utente
        const utenteData = await contract.get_nickname_address(account);
        setUtenteInfo(utenteData);
  
        // Recupera i post del gruppo
        const postsData = await contract.getPost(groupId);
        const parsedPosts = postsData
        .filter((post) => post[3] !== "") // Filtra i post con descrizione vuota
        .map((post) => ({
          id: Number(post[1]),
          likes: Number(post[4]),
          content: post[3],
          author: post[5],
          status: post[6],
        }));
        
        setPosts(parsedPosts);
  
        // Recupera i commenti per tutti i post
        const allComments = {};
        for (const post of parsedPosts) {
          const commentiData = await contract.getCommenti(post.id);
          const parsedCommenti = commentiData.map((comment) => ({
            id: Number(comment[0]),
            descrizione: comment[1],
            author: comment[2],
          }));
          allComments[post.id] = parsedCommenti;
        }
  
        setCommentoInfo(allComments);  // Salva tutti i commenti nello stato
  
      } catch (error) {

        console.error("Errore nel recupero dei dati del gruppo:", error);
      }
    };
  
    fetchGroupData();
  }, [groupId]);
  

  const createPost = async (e) => {
    e.preventDefault();
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(amethystAddress, amethystABI, signer);

      const tx = await contract.createPost(groupId, "", descrizione);
      await tx.wait();

      const postsData = await contract.getPost(groupId);
      const parsedPosts = postsData
      .filter((post) => post[3] !== "") // Filtra i post con descrizione vuota
      .map((post) => ({
        id: Number(post[1]),
        likes: Number(post[4]),
        content: post[3],
        author: post[5],
        status: post[6],
      }));

      setPosts(parsedPosts);
      setDescrizione("");

      const groupData = await contract.getGruppId(groupId);
      setGroupInfo({
        nick_group: groupData.nick_group,
        n_like: groupData.n_like,
        n_post: groupData.n_post,
        descrizione: groupData.descrizione || "Nessuna descrizione disponibile"
      });
      showAlert("Post creato con successo, complimenti", "successo");

    } catch (error) {
      showAlert("Errore durante la creazione del post, riprova!", "errore");

      console.error("Errore durante la creazione del post:", error);
    }
  };

  const addLike = async (postId) => {
    try {

      console.log("id likeeeeeee:", postId)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(amethystAddress, amethystABI, signer);

      const tx = await contract.addLike(postId); // Passiamo l'ID del post
      await tx.wait();

      // Aggiorniamo lo stato dei post dopo aver aggiunto un like
      const updatedPosts = posts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      );
      setPosts(updatedPosts);

      const groupData = await contract.getGruppId(groupId);
      setGroupInfo({
        nick_group: groupData.nick_group,
        n_like: groupData.n_like,
        n_post: groupData.n_post,
        descrizione: groupData.descrizione || "Nessuna descrizione disponibile"
      });
      showAlert("Like aggiunto con successo!", "successo");


    } catch (error) {

      showAlert("Errore durante l'inserimento del like, riprova!", "errore");

      console.error("Errore durante l'aggiunta del like:", error);
    }
  };

  const addCommento = async (postId, descrizione) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(amethystAddress, amethystABI, signer);
  
      // Creazione del commento nel contratto
      const tx = await contract.create_commento(postId, descrizione);
      await tx.wait(); 
  
      // Recupera i commenti aggiornati per il post
      const commentiData = await contract.getCommenti(postId); // Supponiamo che il contratto abbia questo metodo
  
      // Mappa i dati dei commenti ricevuti
      const parsedCommenti = commentiData.map((c) => ({
        id: Number(c[0]),
        descrizione: c[1], 
        author: c[2], 
      }));
  
      // Aggiorna lo stato dei commenti per il post
      setCommentoInfo((prevState) => ({
        ...prevState,
        [postId]: parsedCommenti, // Sovrascrive i commenti del post con quelli aggiornati
      }));
  
      // Resetta il campo di testo e chiude la sezione dei commenti
      setCommentText("");
      setSelectedPostId(null);

      showAlert("Commento aggiunto con successo!", "successo");

    } catch (error) {

      showAlert("Commento non inserito correttamente, riprova!", "errore");

      console.error("Errore durante l'aggiunta del commento:", error);
    }
  };
  
  const deletePost = async (postId) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(amethystAddress, amethystABI, signer);
      
      console.log("DELETE: ", postId);

      // Invia una transazione per cancellare il post
      const tx = await contract.deletePost(postId);
      await tx.wait();
      
      // Rimuovi il post dallo stato dei post
      setPosts(posts.filter((post) => post.id !== postId));
  
      console.log(`Post ${postId} eliminato con successo`);

      showAlert("Post eliminato con successo!", "successo");
      // Recupera i dati del gruppo
      const groupData = await contract.getGruppId(groupId);
      setGroupInfo({
        nick_group: groupData.nick_group,
        n_like: groupData.n_like,
        n_post: groupData.n_post,
        descrizione: groupData.descrizione || "Nessuna descrizione disponibile"
      });
        


    } catch (error) {

      showAlert("Errore nell'eliminazione del post, riprova!", "errore");

      console.error("Errore durante l'eliminazione del post:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-roboto">
      <Header />
      {/* Sezione Superiore con Informazioni Gruppo */}
      
      <div
        className="relative text-white py-40 mt-20 rounded-lg shadow-md"
        style={{

          backgroundImage: `url(${sfondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} 
      >

        <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl font-bold mb-4 text-center">
            {groupInfo.nick_group || "Gruppo"}
          </h1>
          <div className="flex justify-center space-x-8">
            <p className="text-xl">
              <strong>👍 Likes:</strong> {groupInfo.n_like || 0}
            </p>
            <p className="text-xl">
              <strong>📄 Post:</strong> {groupInfo.n_post || 0}
            </p>
          </div>
          <div className="text-center mt-6 text-lg text-white">
            <p>{groupInfo.descrizione}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto my-6 bg-white shadow rounded-lg p-6">
  <div className="flex items-center space-x-4 mb-4">
    {/* Immagine dell'utente */}
    <img
      src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${utenteInfo || "User"}`}
      alt="Avatar"
      className="w-14 h-14 rounded-full"
    />
    
    {/* Campo di testo per il post */}
    <textarea
      className="w-full border border-gray-300 rounded-md p-4 focus:ring focus:ring-blue-300 text-gray-700 resize-none"
      placeholder="Scrivi qui..."
      rows="4"
      value={descrizione}
      onChange={(e) => setDescrizione(e.target.value)}
    ></textarea>
    
    {/* Bottone di invio con icona SVG */}
    <button
      type="submit"
      className="ml-4 p-3 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-800"
      onClick={createPost}
    >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
      <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
    </svg>
    </button>
  </div>
</div>


    {/* Elenco Post */}
    <div className="max-w-2xl mx-auto space-y-6 mb-6">
  {posts.map((post) => (
    <div key={post.id} className="bg-white shadow rounded-lg p-4">
      <div className="flex items-center space-x-4 mb-2">
        <img
          src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${post.author}`}
          alt="Avatar"
          className="w-12 h-12 rounded-full"
        />
        <p className="text-gray-800 font-semibold">{post.author}</p>
      </div>

      <p className="text-gray-800 text-lg mb-4">{post.content}</p>

      <div className="flex justify-between items-center">
        <button
          className="text-red-600 hover:text-red-800 font-semibold flex items-center"
          onClick={() => addLike(post.id)} // Passiamo l'ID del post per aggiungere un like
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
          </svg>
          <p className="ml-2">{post.likes || 0}</p>
        </button>
        <button className="text-gray-600 hover:text-gray-800 font-semibold" onClick={() => setSelectedPostId(post.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-dots" viewBox="0 0 16 16">
            <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
            <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2"/>
          </svg>
        </button>
    {/* Aggiungi il controllo per il tasto Elimina */}
    {post.author === utenteInfo && (  // Se l'autore del post è lo stesso dell'utente loggato
        <button
          className="text-red-600 hover:text-red-800 font-semibold flex items-center"
          onClick={() => deletePost(post.id)} // Cliccando si elimina il post
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
          </svg>
          <p className="ml-2">Elimina</p>
        </button>
      )}
      </div>

      {/* Sezione commenti */}
      {selectedPostId === post.id && (
        <div className="mt-4">
          <div className="space-y-2">
            {commentoInfo[post.id] && commentoInfo[post.id].length > 0 ? (
              commentoInfo[post.id].map((comment, index) => (
                <div key={index} className="border p-2 rounded">
                  <p className="text-gray-800">
                    <strong>{comment.author}:</strong> {comment.descrizione}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Nessun commento ancora.</p>
            )}
          </div>
          <textarea
            className="w-full border rounded-md p-2"
            placeholder="Scrivi un commento..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
          <button
            className="mt-2 p-2 bg-purple-500 text-white rounded hover:bg-purple-800"
            onClick={() => addCommento(post.id, commentText)}
          >
            Invia Commento
          </button>
        </div>
      )}
    </div>
  ))}
</div>





      <Footer />
    </div>
  );
};

export default GruppoPage;
