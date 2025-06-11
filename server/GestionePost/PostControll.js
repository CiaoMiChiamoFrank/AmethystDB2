const {createPostService, updatePostService, getPostService, deletePostService, addLikeService} = require('./PostService')
const express = require ('express')
const routPost = express.Router()

routPost.post('/createPost', async (req, res) => {
    try {
        const { id_gruppo, title, descrizione, author, path } = req.body;
        const  id_metamask = req.body.id_metamask.toUpperCase()
        if (!id_gruppo || !id_metamask || !descrizione || !author) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Chiamata al servizio per creare il post con i dati ricevuti
        const newPost = await createPostService(
            id_gruppo,
            id_metamask,
            title,
            descrizione,
            author,
            path || '' // Se 'path' non è fornito, usa una stringa vuota
        );

        // Rispondi al frontend con il risultato dell'operazione
        if (newPost) {
            res.status(201).json({ success: true, message: 'Post created successfully', post: newPost });
        } else {
            res.status(500).json({ success: false, message: 'Failed to create post' });
        }
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

routPost.delete('/deletePost', async (req, res) => {
    try {
        const { id_post, id_gruppo } = req.body; 
        const  id_metamask = req.body.id_metamask.toUpperCase()

        if (!id_post || !id_metamask) {
            return res.status(400).json({ success: false, message: 'ID post e ID Metamask sono richiesti per l\'eliminazione.' });
        }

        const success = await deletePostService(id_post, id_metamask, id_gruppo);
        
        if (success) {
            res.status(200).json({ success: true, message: 'Post eliminato con successo.' });
        } else {
            res.status(403).json({ success: false, message: 'Impossibile eliminare il post. Verificare l\'autorizzazione o l\'esistenza del post.' });
        }
    } catch (error) {
        console.error('Errore durante l\'eliminazione del post:', error);
        res.status(500).json({ success: false, message: 'Errore interno del server durante l\'eliminazione del post.', error: error.message });
    }
});


routPost.get('/getPostAll/:id', async (req, res) => {
  const idGruppo = req.params.id;
  const post = await getPostService(idGruppo);
  res.json(post);
});

routPost.get('/updatePost', async (req, res) => {
  const bool = await updatePostService(
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    'Sono GAY 100kg',
    '100 kg di piselli',
    '6831fd415bf12cd21d4f1852'
  );
  res.json(bool);
});

routPost.post('/addLike', async (req, res) => {
  const { id_post, id_metamask } = req.body;
  const metamaskUpper = id_metamask.toUpperCase();

  console.log("LIKEEEEEE BACKEND:   ", id_post, metamaskUpper);

  try {
    const success = await addLikeService(id_post, metamaskUpper);

    if (success) {
      res.status(200).json({ message: "Like aggiunto con successo" });
    } else {
      res.status(400).json({ error: "Like già presente o errore logico" });
    }
  } catch (err) {
    console.error("Errore in addLike:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
});



module.exports  = routPost