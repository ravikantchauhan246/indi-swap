

// // require("@nomiclabs/hardhat-waffle");
// // require("@nomiclabs/hardhat-ethers");

// // const PRIVATE_KEY = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";

// // module.exports = {
// //   solidity: {
// //     version: "0.7.6",
// //     settings: {
// //       optimizer: {
// //         enabled: true,
// //         runs: 1000,
// //       },
// //       evmVersion: "istanbul"
// //     }
// //   },
// //   networks: {
// //     hardhat: {
// //       forking: {
// //         // url: "https://eth-mainnet.g.alchemy.com/v2/XbTCI1sk-nWg_2lJu90LU9FjQS6I94qj",
// //         url: "https://eth-mainnet.g.alchemy.com/v2/A1QqJNUZQPujsSLrSHnkIqwlzi1fJb5Z",
// //         blockNumber: 15000000
// //       },
// //       chainId: 31337
// //     },
// //     holesky: {
// //       url: "https://holesky.infura.io/v3/1461cb893dc8442187be2524ee8cdd16",
      
// //       accounts: [PRIVATE_KEY]
// //     }
// //   }
// // };


// // // require("@nomicfoundation/hardhat-toolbox");
// // require("@nomiclabs/hardhat-waffle");

// // /** @type import('hardhat/config').HardhatUserConfig */
// const ETHEREUM_HOLESKY =
//   "https://holesky.infura.io/v3/1461cb893dc8442187be2524ee8cdd16";

//   const PRIVATE_KEY = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";

// // module.exports = {
// //   solidity: {
// //     compilers: [
// //       {
// //         version: "0.7.6",
// //         settings: {
// //           evmVersion: "istanbul",
// //           optimizer: {
// //             enabled: true,
// //             runs: 1000,
// //           },
// //         },
// //       },
// //     ],
// //   },
// //   networks: {
// //     hardhat: {
// //       forking: {
// //         url: "https://eth-mainnet.g.alchemy.com/v2/XbTCI1sk-nWg_2lJu90LU9FjQS6I94qj",
// //       },
// //     },

// //     ethereum: {
// //       url: "https://mainnet.infura.io/v3/9c481e1168e54cd39869bd50daa755bd",
// //       accounts: [`0x${PRIVATE_KEY}`],
// //     },

// //     ethereum_holesky: {
// //       url: ETHEREUM_HOLESKY,
// //       accounts: [`0x${PRIVATE_KEY}`],
// //     },
// //   },
// // };

// require("@nomiclabs/hardhat-waffle");

// module.exports = {
//   solidity: {
//     version: "0.7.6",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 5000,
//         details: { yul: false },
//       },
//     },
//   },
//   networks: {
//     hardhat: {
//       forking: {
//         url: "https://eth-mainnet.g.alchemy.com/v2/A1QqJNUZQPujsSLrSHnkIqwlzi1fJb5Z",
//         accounts: [`0x${PRIVATE_KEY}`],
//       },
//     },
//   },
// };

require("@nomiclabs/hardhat-waffle");

const PRIVATE_KEY = "5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";

module.exports = {
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5000,
        details: { yul: false },
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/A1QqJNUZQPujsSLrSHnkIqwlzi1fJb5Z",
        blockNumber: 15000000, // Optional: pin to a block you know works
      },
      chainId: 31337,
    },
  },
};
