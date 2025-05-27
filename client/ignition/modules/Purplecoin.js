const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Purplecoin", (m) => {
  const coin = m.contract("PurpleCoin", [], {
  });

  return { coin };
});
