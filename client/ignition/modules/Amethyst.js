const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployContracts", (m) => {
  // Step 1: Deploy del contratto PurpleCoin
  const purpleCoin = m.contract("PurpleCoin", [], {});

  // Step 2: Usa l'indirizzo del contratto PurpleCoin per deployare Amethyst
  const amethyst = m.contract("Amethyst", [purpleCoin], {});

  return { purpleCoin, amethyst };
});
