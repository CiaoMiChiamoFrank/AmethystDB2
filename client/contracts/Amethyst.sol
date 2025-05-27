// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
import "./Purplecoin.sol";

/*
Design Pattern applicati:
- Access Restriction
- Check-Effect-Interaction
- Emergency Stop
- Guard Check

*/
contract Amethyst {
    //--------------------------------------UTENTE-----------------------------------------------------

    struct Utente {
        address id;
        string nick_name;
        string biografia;
    }

    mapping(address => Utente) private accounts;
    mapping(address => bool) private accounts_created; //per gestire se lutente è "iscritto" alla piattaforma o no
    address[] private nick_name_used;
    PurpleCoin private purpleCoin;

    // Emergency Stop
    bool private emergencyStop = false;
    address private admin; //solo l'utente potrà attivare l'emergency stop

    modifier emergencyActive() {
        require(
            !emergencyStop,
            "Emergenza attiva: tutte le operazioni sono sospese."
        );
        _;
    }

    //access restriction all'admin
    modifier onlyAdmin() {
        require(
            msg.sender == admin,
            "Solo l'amministratore puo' eseguire questa operazione."
        );
        _;
    }

    // funzione per attivare o disattivare l'emergenza consentita solo all'admin
    function toggleEmergencyStop() public onlyAdmin {
        emergencyStop = !emergencyStop;
    }

    constructor(address _purpleCoinAddress) {
        purpleCoin = PurpleCoin(_purpleCoinAddress);
        admin = msg.sender; //per ora chi deploya il contratto è l'admin

        // creiamo 10 gruppi statici, per ora non c'è ancora la possibilità di crearlo dinamicamente --> coming soon
        createGruppo("Sport", "Discussioni su sport e attivita' fisica");
        createGruppo(
            "Programmazione",
            "Tematiche di coding e sviluppo software"
        );
        createGruppo("Musica", "Condividi le tue passioni musicali");
        createGruppo("Cucina", "Ricette e trucchi culinari");
        createGruppo("Viaggi", "Destinazioni e consigli di viaggio");
        createGruppo("Cinema", "Film, serie TV e recensioni");
        createGruppo("Libri", "Discussioni su romanzi e letture interessanti");
        createGruppo("Videogiochi", "Tutto sui videogames e il gaming");
        createGruppo("Fitness", "Allenamenti, diete e consigli per la salute");
        createGruppo("Tecnologia", "Ultime novita' e trend tech");
    }

    // Check: Verifica se il nick name è già in uso
    modifier check_exists_nick_name(string memory _name) {
        uint256 i = 0;

        for (i = 0; i < nick_name_used.length; i++) {
            require(
                (keccak256(bytes(accounts[nick_name_used[i]].nick_name)) !=
                    keccak256(bytes(_name))),
                "Mi dispiace, nick_name esistente :("
            );
        }
        _;
    }

    // Check: Verifica se l'account esiste già
    modifier check_exists_account() {
        require(
            !accounts_created[msg.sender],
            "L'account esiste, effettua il login :("
        );
        _;
    }

    // Funzione per creare un nuovo account sulla piattaforma amethyst
    function create_account(
        address _accountAddress, // Indirizzo della persona a cui assegnare il nickname
        string memory _name //vari controlli di Check
    )
        public
        check_exists_account
        check_exists_nick_name(_name)
        emergencyActive
    {
        // Effect: Modifica lo stato del contratto prima di fare qualsiasi interazione
        Utente memory u = Utente({
            id: _accountAddress,
            nick_name: _name,
            biografia: ""
        });

        accounts[_accountAddress] = u;
        nick_name_used.push(_accountAddress);
        accounts_created[_accountAddress] = true;

        //Nessuna Interaction con contratti esterni.
    }

    // otteniamo tutti gli utenti registrati sulla piattaforma
    function get_utente() public view returns (string[] memory) {
        string[] memory nick_names = new string[](nick_name_used.length);
        uint256 i = 0;

        for (i = 0; i < nick_name_used.length; i++) {
            nick_names[i] = accounts[nick_name_used[i]].nick_name;
        }

        return nick_names;
    }

    // controlliamo il booleano di un utente per vedere se è registrato o no
    function get_utente_registrato(address _utente) public view returns (bool) {
        return accounts_created[_utente];
    }

    // otteniamo gli indirizzi degli utenti registrati
    function get_address() public view returns (address[] memory) {
        return nick_name_used;
    }

    //otteniamo tutti i nicknami che hanno scelto gli utenti in fase di registrazione
    function get_nickname_address(
        address user
    ) public view returns (string memory) {
        string memory _nick_name = accounts[user].nick_name;
        return _nick_name;
    }

    // la possibilità di cambiare il nome dell'utente
    function modifyNickname(
        string memory _newNickName
    ) public check_exists_nick_name(_newNickName) emergencyActive {
        // Check: controlla che l'account sia esistente
        require(accounts_created[msg.sender], "Account non esistente.");

        // Effect: modifica lo stato del nickname prima di qualsiasi interazione
        accounts[msg.sender].nick_name = _newNickName;

        // (Non ci sono interazioni esterne in questa funzione)
    }

    // posso aggiungere se non esiste o modificare la mia biografia
    function addBiografia(string memory _biografia) public emergencyActive {
        //Check
        require(accounts_created[msg.sender], "Account non esistente.");

        // Effect
        accounts[msg.sender].biografia = _biografia;

        //NO Interaction
    }

    //ottengo la biografia di un utente
    function getBiografy(address user) public view returns (string memory) {
        //Guard Check
        require(accounts_created[user], "Account non esistente.");
        return accounts[user].biografia;
    }

    //----------------------END-UTENTE------------------------------------------------------------

    //---------------------------------GRUPPO-----------------------------------------------------
    struct Gruppo {
        uint256 id_gruppo;
        string nick_group;
        string descrizione;
        uint256 n_like;
        uint256 n_post;
    }

    struct Post {
        uint256 id_gruppo_post;
        uint256 id_post;
        string titolo;
        string descrizione;
        uint256 n_like;
        string account;
        bool rewarded;
        address _sender;
    }

    struct Commento {
        uint256 id_post_commento;
        string descrizione;
        string account;
    }

    //ogni gruppo parte da 0 come commenti like e post e ne tiene il conteggio per funzionalità future --> coming soon
    uint256 private count_id_gruppo = 0;
    uint256 private count_id_post = 0;
    uint256 private count_id_commento = 0;
    mapping(uint256 => Gruppo) private gruppi;
    mapping(uint256 => Post) private posts;
    mapping(uint256 => Commento) private commenti;

    // mapping utente --> like --> post
    mapping(address => mapping(uint256 => bool)) private userLikes; // mapping(address => mapping(postId => bool))

    // design-pattern -> Access Restriction
    modifier only_account_registred() {
        require(accounts_created[msg.sender], "Account non registrato");
        _;
    }

    // design-pattern -> Access Restriction
    modifier only_group_exist(uint256 _id_gruppo) {
        require(_id_gruppo <= 9 && _id_gruppo >= 0, "Il Gruppo non esiste :(");
        _;
    }

    //controlli sulla lungezza
    modifier check_length_titolo(string memory _titolo) {
        require(
            bytes(_titolo).length <= 65,
            "Il titolo supera la lunghezza massima di 65 caratteri"
        );
        _;
    }

    //controlli per evitare di mettere due like
    modifier check_like(uint256 _id_post) {
        require(
            !userLikes[msg.sender][_id_post],
            "Hai gia' messo like a questo post."
        );
        _;
    }

    //controlli per vedere se il post in questione esiste
    modifier check_id_post(uint256 _id_post) {
        require(
            _id_post >= 0 && _id_post <= count_id_post,
            "Il post non esiste"
        );
        _;
    }

    // design-pattern -> Access Restriction
    modifier only_post_author(uint256 _id_post) {
        require(
            posts[_id_post]._sender == msg.sender,
            "Solo l autore del post puo eliminarlo"
        );
        _;
    }

    //funzione per la creazione dei gruppi con eventuali controlli
    function createGruppo(
        string memory nick,
        string memory _descrizione
    ) private emergencyActive {
        Gruppo memory g = Gruppo({
            id_gruppo: count_id_gruppo,
            nick_group: nick,
            descrizione: _descrizione,
            n_like: 0,
            n_post: 0
        });

        gruppi[count_id_gruppo] = g;
        count_id_gruppo++;
    }

    //funzione crea post per utente
    function createPost(
        uint256 _id_gruppo,
        string memory _titolo,
        string memory _descrizione //Check
    )
        public
        only_account_registred
        only_group_exist(_id_gruppo)
        check_length_titolo(_titolo)
        emergencyActive
    {
        // Effect
        Post memory post = Post({
            id_gruppo_post: _id_gruppo,
            id_post: count_id_post,
            titolo: _titolo,
            descrizione: _descrizione,
            n_like: 0,
            account: get_nickname_address(msg.sender),
            rewarded: false,
            _sender: msg.sender
        });

        gruppi[_id_gruppo].n_post++;
        posts[count_id_post] = post;
        count_id_post++;

        //NO Interaction con contratti esterni
    }

    // prelevo tutti i post di un gruppo specifico
    function getAllPosts() public view returns (Post[] memory) {
        Post[] memory allPosts = new Post[](count_id_post);
        for (uint256 i = 0; i < count_id_post; i++) {
            allPosts[i] = posts[i];
        }
        return allPosts;
    }

    //preleveo i gruppi
    function getGruppi() public view returns (Gruppo[] memory) {
        Gruppo[] memory allGruppi = new Gruppo[](count_id_gruppo);

        for (uint256 i = 0; i < count_id_gruppo; i++) {
            allGruppi[i] = gruppi[i];
        }

        return allGruppi;
    }

    // gruppo in base all'id
    function getGruppId(uint256 _id) public view returns (Gruppo memory) {
        return gruppi[_id];
    }

    // prelevo il post sempre in base all'id
    function getPost(
        uint256 _id_gruppo
    ) public view only_group_exist(_id_gruppo) returns (Post[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < count_id_post; i++) {
            if (posts[i].id_gruppo_post == _id_gruppo) {
                count++;
            }
        }

        Post[] memory groupPosts = new Post[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < count_id_post; i++) {
            if (posts[i].id_gruppo_post == _id_gruppo) {
                groupPosts[index] = posts[i];
                index++;
            }
        }

        return groupPosts;
    }

    // logica di premiatura in base ai like... disegno vari livelli di premiatura designando un booleano per vedere se è già stato premiato quel livello post --> like --> si/no
    mapping(uint256 => mapping(uint256 => bool)) private rewardedLevels;

    // Funzione per aggiungere un like a un post
    function addLike(
        uint256 _id_post
    )
        public
        only_account_registred
        check_like(_id_post)
        check_id_post(_id_post)
        emergencyActive
    {
        // --- CHECK: Validazioni e controlli ---
        require(posts[_id_post]._sender != address(0), "Post non esistente.");
        require(
            !userLikes[msg.sender][_id_post],
            "Hai gia messo un like a questo post."
        );

        // --- EFFECT: Aggiorna lo stato ---
        posts[_id_post].n_like++;
        uint256 _id_gruppo = posts[_id_post].id_gruppo_post;
        gruppi[_id_gruppo].n_like++;
        userLikes[msg.sender][_id_post] = true;

        // --- INTERACTION: Interazioni esterne --- (con Purple Coin)
        uint256[6] memory livelli = [uint256(3), 5, 10, 50, 100, 500];
        uint256[6] memory premi = [uint256(5), 10, 15, 20, 30, 50];

        for (uint256 i = 0; i < livelli.length; i++) {
            if (
                posts[_id_post].n_like == livelli[i] && // controlla se è stato raggiunto un livello di reward
                !rewardedLevels[_id_post][i] // controlla che il livello non sia già stato premiato
            ) {
                rewardedLevels[_id_post][i] = true;
                purpleCoin.mint(posts[_id_post]._sender, premi[i]); // Interazione esterna: Minta i premi
            }
        }
    }

    // creaimo un commento
    function create_commento(
        uint256 _id_post,
        string memory _descrizione
    ) public only_account_registred check_id_post(_id_post) emergencyActive {
        Commento memory commento = Commento({
            id_post_commento: _id_post,
            descrizione: _descrizione,
            account: get_nickname_address(msg.sender)
        });

        commenti[count_id_commento] = commento;
        count_id_commento++;
    }

    // funzione che ci permette di verificare quanti commenti appartengono ad un post
    function getCommenti(
        uint256 _id_post
    ) public view check_id_post(_id_post) returns (Commento[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < count_id_commento; i++) {
            if (commenti[i].id_post_commento == _id_post) {
                count++;
            }
        }

        Commento[] memory postCommenti = new Commento[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < count_id_commento; i++) {
            if (commenti[i].id_post_commento == _id_post) {
                postCommenti[index] = commenti[i];
                index++;
            }
        }

        return postCommenti;
    }

    // funzione per eliminare un post
    function deletePost(
        uint256 _id_post
    )
        public
        only_post_author(_id_post)
        check_id_post(_id_post)
        emergencyActive
    {
        uint256 groupId = posts[_id_post].id_gruppo_post;
        uint256 n_like_post = posts[_id_post].n_like;

        gruppi[groupId].n_like = gruppi[groupId].n_like - n_like_post;
        gruppi[groupId].n_post--;

        delete posts[_id_post];
    }
}
