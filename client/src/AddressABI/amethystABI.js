export const amethystABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_purpleCoinAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_biografia",
        "type": "string"
      }
    ],
    "name": "addBiografia",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id_post",
        "type": "uint256"
      }
    ],
    "name": "addLike",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id_gruppo",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_titolo",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_descrizione",
        "type": "string"
      }
    ],
    "name": "createPost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_accountAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "create_account",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id_post",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_descrizione",
        "type": "string"
      }
    ],
    "name": "create_commento",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id_post",
        "type": "uint256"
      }
    ],
    "name": "deletePost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllPosts",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id_gruppo_post",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "id_post",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "titolo",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "descrizione",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "n_like",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "account",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "rewarded",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "_sender",
            "type": "address"
          }
        ],
        "internalType": "struct Amethyst.Post[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getBiografy",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id_post",
        "type": "uint256"
      }
    ],
    "name": "getCommenti",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id_post_commento",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "descrizione",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "account",
            "type": "string"
          }
        ],
        "internalType": "struct Amethyst.Commento[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getGruppId",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id_gruppo",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "nick_group",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "descrizione",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "n_like",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "n_post",
            "type": "uint256"
          }
        ],
        "internalType": "struct Amethyst.Gruppo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGruppi",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id_gruppo",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "nick_group",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "descrizione",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "n_like",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "n_post",
            "type": "uint256"
          }
        ],
        "internalType": "struct Amethyst.Gruppo[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id_gruppo",
        "type": "uint256"
      }
    ],
    "name": "getPost",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id_gruppo_post",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "id_post",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "titolo",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "descrizione",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "n_like",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "account",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "rewarded",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "_sender",
            "type": "address"
          }
        ],
        "internalType": "struct Amethyst.Post[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "get_address",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "get_nickname_address",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "get_utente",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_utente",
        "type": "address"
      }
    ],
    "name": "get_utente_registrato",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_newNickName",
        "type": "string"
      }
    ],
    "name": "modifyNickname",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "toggleEmergencyStop",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]