import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import sfondo from "../assets/cavern_amethyst.png";
import { AccountContext } from "../context/AccountContext";
import { useAlert } from "../context/AlertContext";

const GruppoPage = () => {
  const { account } = useContext(AccountContext);
  const [groupInfo, setGroupInfo] = useState({});
  const [utenteInfo, setUtenteInfo] = useState("");
  const [commentoInfo, setCommentoInfo] = useState({});
  const location = useLocation();
  const { groupId } = location.state || {};
  const [descrizione, setDescrizione] = useState("");
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState("");
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

        const resUtente = await fetch(`http://localhost:5000/Utente/getAccount/${account}`);
        const utente = await resUtente.json();
        setUtenteInfo(utente.nickname);

        const resPosts = await fetch(`http://localhost:5000/apiPost/getPostAll/${groupId}`);
        const postsData = await resPosts.json();
        setPosts(postsData);

        const allComments = {};
        for (const post of postsData) {
          const res = await fetch(`http://localhost:5000/apiCommento/getCommentiByPostId/${post._id}`);
          const commentsForPost = await res.json();
          allComments[post._id] = commentsForPost;
        }
        setCommentoInfo(allComments);
      } catch (err) {
        console.error("Errore nel fetch:", err);
      }
    };

    fetchGroupData();
  }, [groupId, account]);

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

      const response = await fetch("http://localhost:5000/apiPost/createPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (response.ok) {
        showAlert("Post creato con successo!", "successo");
        setDescrizione("");

        const resPosts = await fetch(`http://localhost:5000/apiPost/getPostAll/${groupId}`);
        const updatedPosts = await resPosts.json();
        setPosts(updatedPosts);

        const resGruppo = await fetch(`http://localhost:5000/apiGruppo/getGruppo/${groupId}`);
        const gruppoAggiornato = await resGruppo.json();
        setGroupInfo(gruppoAggiornato);
      } else {
        showAlert(`Errore: ${result.message || "Riprova!"}`, "errore");
      }
    } catch (error) {
      showAlert("Errore durante la creazione del post", "errore");
    }
  };

  const addLike = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/apiPost/addLike`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_post: postId, id_metamask: account }),
      });

      const result = await response.json();

      if (response.ok) {
        showAlert("Like aggiunto con successo!", "successo");
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === postId ? { ...post, n_like: (post.n_like || 0) + 1 } : post
          )
        );
        setGroupInfo(prev => ({
          ...prev,
          n_like: (prev.n_like || 0) + 1
        }));
      } else {
        showAlert(`Errore: ${result.message || "Riprova!"}`, "errore");
      }
    } catch (error) {
      showAlert("Errore durante l'aggiunta del like", "errore");
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

      const response = await fetch("http://localhost:5000/apiCommento/createCommento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentoData),
      });

      const result = await response.json();

      if (response.ok) {
        showAlert("Commento aggiunto!", "successo");
        setCommentText("");
        const res = await fetch(`http://localhost:5000/apiCommento/getCommentiByPostId/${postId}`);
        const updatedComments = await res.json();
        setCommentoInfo(prev => ({
          ...prev,
          [postId]: updatedComments,
        }));
      } else {
        showAlert("Errore durante l'aggiunta del commento", "errore");
      }
    } catch (error) {
      showAlert("Errore nel server per il commento", "errore");
    }
  };

  const deletePost = async (postIdToDelete) => {
    try {
      const response = await fetch(`http://localhost:5000/apiPost/deletePost`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_post: postIdToDelete,
          id_metamask: account,
          id_gruppo: groupId
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showAlert("Post eliminato!", "successo");
        setPosts(prev => prev.filter((post) => post._id !== postIdToDelete));

        const resGruppo = await fetch(`http://localhost:5000/apiGruppo/getGruppo/${groupId}`);
        const gruppoAggiornato = await resGruppo.json();
        setGroupInfo(gruppoAggiornato);
      } else {
        showAlert(`Errore eliminazione: ${result.message || "Riprova!"}`, "errore");
      }
    } catch (error) {
      showAlert("Errore durante l'eliminazione del post", "errore");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-roboto">
      <Header />
      <div
        className="relative text-white py-40 mt-20 rounded-lg shadow-md"
        style={{
          backgroundImage: `url(${sfondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">{groupInfo.nick_gruppo || "Gruppo"}</h1>
          <div className="flex justify-center space-x-8 text-xl">
            <p><strong>👍 Likes:</strong> {groupInfo.n_like || 0}</p>
            <p><strong>📄 Post:</strong> {groupInfo.n_post || 0}</p>
          </div>
          <p className="mt-6 text-lg">{groupInfo.descrizione}</p>
        </div>
      </div>

      {/* Post creation box */}
      <div className="max-w-4xl mx-auto my-6 bg-white shadow rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <img
            src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${utenteInfo || "User"}`}
            alt="Avatar"
            className="w-14 h-14 rounded-full"
          />
          <textarea
            className="w-full border border-gray-300 rounded-md p-4 focus:ring focus:ring-blue-300 text-gray-700 resize-none"
            placeholder="Scrivi qui..."
            rows="4"
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="ml-2 p-3 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-800"
            onClick={createPost}
          >
            ➤
          </button>
        </div>
      </div>

      {/* Post list */}
      <div className="max-w-2xl mx-auto space-y-6 mb-10">
        {currentPosts.map((post) => (
          <div key={post._id} className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center space-x-4 mb-2">
              <img
                src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${post.author}`}
                alt="Avatar"
                className="w-12 h-12 rounded-full"
              />
              <p className="text-gray-800 font-semibold">{post.author}</p>
            </div>
            <p className="text-gray-800 text-lg mb-2">{post.descrizione}</p>
            <div className="flex justify-between">
              <button onClick={() => addLike(post._id)} className="text-red-600 font-semibold">
                ❤️ {post.n_like || 0}
              </button>
              <button onClick={() => deletePost(post._id)} className="text-sm text-gray-500 hover:text-red-600">Elimina</button>
            </div>
          </div>
        ))}

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

      </div>

      <Footer />
    </div>
  );
};

export default GruppoPage;
