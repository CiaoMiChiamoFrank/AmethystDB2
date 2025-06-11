import React, { useState, useEffect, useContext } from "react";
import { ethers, id } from "ethers"; // Questi sembrano non essere usati, potresti rimuoverli se non necessari.
import { amethystAddress } from "../AddressABI/amethystAddress"; // Questi sembrano non essere usati, potresti rimuoverli se non necessari.
import { amethystABI } from "../AddressABI/amethystABI"; // Questi sembrano non essere usati, potresti rimuoverli se non necessari.
import Header from "./header";
import Footer from "./footer";
import { useLocation } from "react-router-dom";
import sfondo from "../assets/cavern_amethyst.png";
import { AccountContext } from '../context/AccountContext';
import { useAlert } from '../context/AlertContext';

const GruppoPage = () => {
  const { account } = useContext(AccountContext);
  const [groupInfo, setGroupInfo] = useState({});
  const [utenteInfo, setUtenteInfo] = useState("");
  const [commentoInfo, setCommentoInfo] = useState({}); // Questo ora conterrà i commenti del *singolo* post selezionato
  const location = useLocation();
  const { groupId } = location.state || {};
  const [descrizione, setDescrizione] = useState("");
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null); // Traccia il post selezionato per il commento
  const [commentText, setCommentText] = useState(""); // Testo del commento
  const [nome, setNome] = useState(null);

  const { showAlert } = useAlert();

  // Paginazione
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);


  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const resGruppo = await fetch(`http://localhost:5000/apiGruppo/getGruppo/${groupId}`);
        const gruppo = await resGruppo.json();
        setGroupInfo(gruppo);
        setNome(gruppo.nick_gruppo);

        console.log('gruppo preso con successo!!!', gruppo.nick_gruppo);
        console.log('cosa cazzo ti passsi', account);

        const resUtente = await fetch(`http://localhost:5000/Utente/getAccount/${account}`);
        const utente = await resUtente.json();
        setUtenteInfo(utente.nickname);

        console.log('utente preso con successo.', utente.nickname);

        const resPosts = await fetch(`http://localhost:5000/apiPost/getPostAll/${groupId}`);
        const postsData = await resPosts.json();
        setPosts(postsData);
        console.log('Stampa tutto post', postsData);

        // Rimosso il caricamento di tutti i commenti qui

      } catch (err) {
        console.error("Errore nel fetch:", err);
      }
    };
    fetchGroupData();
  }, [groupId, account]);

  // Nuovo useEffect per caricare i commenti solo quando selectedPostId cambia
  useEffect(() => {
    const fetchCommentsForSelectedPost = async () => {
      if (selectedPostId) {
        try {
          const res = await fetch(`http://localhost:5000/apiCommento/getCommentiByPostId/${selectedPostId}`);
          const commentsForPost = await res.json();
          setCommentoInfo(commentsForPost); // Imposta i commenti per il post selezionato
        } catch (err) {
          console.error(`Errore nel caricamento dei commenti per il post ${selectedPostId}:`, err);
          setCommentoInfo([]); // In caso di errore, pulisci i commenti precedenti
        }
      } else {
        setCommentoInfo([]); // Pulisci i commenti se nessun post è selezionato
      }
    };

    fetchCommentsForSelectedPost();
  }, [selectedPostId]); // Dipendenza da selectedPostId

  const createPost = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        id_gruppo: groupId,
        id_metamask: account,
        title: "Titolo di default",
        descrizione: descrizione,
        author: utenteInfo,
        path: "",
      };

      console.log(postData);

      const response = await fetch("http://localhost:5000/apiPost/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (response.ok) {
        showAlert("Post creato con successo, complimenti!", "successo");
        console.log("Post creato:", result.post);
        setDescrizione("");

        const resPosts = await fetch(`http://localhost:5000/apiPost/getPostAll/${groupId}`);
        const updatedPosts = await resPosts.json();
        setPosts(updatedPosts);
        setCurrentPage(1);

        const resGruppo = await fetch(`http://localhost:5000/apiGruppo/getGruppo/${groupId}`);
        const gruppoAggiornato = await resGruppo.json();
        setGroupInfo(gruppoAggiornato);

      } else {
        showAlert(`Errore durante la creazione del post: ${result.message || "Riprova!"}`, "errore");
        console.error("Errore backend durante la creazione del post:", result.error);
      }
    } catch (error) {
      showAlert("Errore di rete o del server durante la creazione del post, riprova!", "errore");
      console.error("Errore generale durante la creazione del post:", error);
    }
  };

  const addLike = async (postId) => {
    try {
      console.log("Adding like to post:", postId);

      const response = await fetch(`http://localhost:5000/apiPost/addLike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_post: postId,
          id_metamask: account,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showAlert("Like aggiunto con successo!", "successo");

        setPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === postId ? { ...post, n_like: (post.n_like || 0) + 1 } : post
          )
        );

        console.log("LIKE AGGIUNTO");

        setGroupInfo(prev => ({
          ...prev,
          n_like: (prev.n_like || 0) + 1
        }));

      } else {
        showAlert(`Errore durante l'aggiunta del like: ${result.message || "Riprova!"}`, "errore");
        console.error("Errore nel backend addLike:", result.error);
      }
    } catch (error) {
      showAlert("Errore durante l'aggiunta del like, riprova!", "errore");
      console.error("Errore durante l'aggiunta del like:", error);
    }
  };


  const addCommento = async (postId) => {
    if (!commentText.trim()) {
      showAlert("Il commento non può essere vuoto!", "errore");
      return;
    }

    try {
      const commentoData = {
        id_post: postId,
        id_metamask: account,
        autore: utenteInfo,
        contenuto: commentText,
      };

      console.log('id_post', postId + '\nid meta', account + '\nautore', utenteInfo + '\ncontenuto', commentText);

      const response = await fetch("http://localhost:5000/apiCommento/createCommento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentoData),
      });

      const result = await response.json();

      if (response.ok) {
        showAlert("Commento aggiunto con successo!", "successo");
        setCommentText(""); // Pulisce il campo

        // Aggiorna i commenti localmente dopo aver aggiunto un nuovo commento
        const res = await fetch(`http://localhost:5000/apiCommento/getCommentiByPostId/${postId}`);
        const updatedComments = await res.json();
        setCommentoInfo(updatedComments); // Aggiorna direttamente l'array dei commenti del post selezionato

      } else {
        showAlert(`Errore: ${result.message || "Impossibile aggiungere il commento."}`, "errore");
        console.error("Errore nel backend addCommento:", result.error);
      }
    } catch (error) {
      showAlert("Errore durante l'aggiunta del commento, riprova!", "errore");
      console.error("Errore nella richiesta addCommento:", error);
    }
  };


  const deletePost = async (postIdToDelete) => {
    try {
      console.log("DELETE: ", postIdToDelete);
      console.log("Account (id_metamask): ", account);
      console.log("ID gruppo: ", groupId);

      const response = await fetch(`http://localhost:5000/apiPost/deletePost`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_post: postIdToDelete,
          id_metamask: account,
          id_gruppo: groupId
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showAlert("Post eliminato con successo!", "successo");
        console.log(`Post ${postIdToDelete} eliminato con successo dal backend`);

        setPosts(prevPosts => prevPosts.filter((post) => post._id !== postIdToDelete));

        const resGruppo = await fetch(`http://localhost:5000/apiGruppo/getGruppo/${groupId}`);
        const gruppoAggiornato = await resGruppo.json();
        setGroupInfo(gruppoAggiornato);

        if (currentPosts.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }

      } else {
        showAlert(`Errore nell'eliminazione del post: ${result.message || "Riprova!"}`, "errore");
        console.error("Errore backend durante l'eliminazione del post:", result.error);
      }
    } catch (error) {
      showAlert("Errore di rete o del server durante l'eliminazione del post, riprova!", "errore");
      console.error("Errore generale durante l'eliminazione del post:", error);
    }
  };


  const handleCommentButtonClick = (postId) => {
    // Se il post cliccato è già selezionato, deselezionalo
    if (selectedPostId === postId) {
      setSelectedPostId(null);
    } else {
      // Altrimenti, seleziona il nuovo post e carica i suoi commenti
      setSelectedPostId(postId);
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
            {groupInfo.nick_gruppo || "Gruppo"}
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
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
            </svg>
          </button>
        </div>
      </div>


      {/* Elenco Post */}
      <div className="max-w-2xl mx-auto space-y-6 mb-6">
        {currentPosts.map((post) => ( // Use currentPosts for rendering
          <div key={post._id} className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center space-x-4 mb-2">
              <img
                src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${post.author}`}
                alt="Avatar"
                className="w-12 h-12 rounded-full"
              />
              <p className="text-gray-800 font-semibold">{post.author}</p>
            </div>

            <p className="text-gray-800 text-lg mb-4">{post.descrizione}</p>

            <div className="flex justify-between items-center">
              <button
                className="text-red-600 hover:text-red-800 font-semibold flex items-center"
                onClick={() => addLike(post._id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                </svg>
                <p className="ml-2">{post.n_like || 0}</p>
              </button>
              <button
                className="text-gray-600 hover:text-gray-800 font-semibold"
                onClick={() => handleCommentButtonClick(post._id)} // Usa la nuova funzione
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-dots" viewBox="0 0 16 16">
                  <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                  <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2" />
                </svg>
              </button>
              {/* Aggiungi il controllo per il tasto Elimina */}
              {post.author === utenteInfo && ( // Se l'autore del post è lo stesso dell'utente loggato
                <button
                  className="text-red-600 hover:text-red-800 font-semibold flex items-center"
                  onClick={() => deletePost(post._id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                  </svg>
                  <p className="ml-2">Elimina</p>
                </button>
              )}
            </div>

            {/* Sezione commenti - mostrata solo se il post è selezionato */}
            {selectedPostId === post._id && (
              <div className="mt-4">
                <div className="space-y-2">
                  {commentoInfo && commentoInfo.length > 0 ? ( // commentoInfo ora è un array diretto
                    commentoInfo.map((comment, index) => (
                      <div key={index} className="border p-2 rounded">
                        <p className="text-gray-800">
                          <strong>{comment.nick_name}:</strong> {comment.descrizione}
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
                  onClick={() => addCommento(post._id)}
                >
                  Invia Commento
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Pagination Controls con ellissi */}
        {posts.length > postsPerPage && (
          <div className="flex justify-center mt-8 flex-wrap gap-2">
            {(() => {
              const buttons = [];
              const delta = 1;

              for (let i = 1; i <= totalPages; i++) {
                if (
                  i <= 2 ||
                  i > totalPages - 2 ||
                  (i >= currentPage - delta && i <= currentPage + delta)
                ) {
                  buttons.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`px-3 py-1 rounded ${
                        currentPage === i ? "bg-purple-600 text-white" : "bg-gray-200 hover:bg-purple-300"
                      }`}
                    >
                      {i}
                    </button>
                  );
                } else if (
                  buttons[buttons.length - 1]?.type !== "span"
                ) {
                  buttons.push(
                    <span key={`dots-${i}`} className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }
              }

              return buttons;
            })()}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default GruppoPage;