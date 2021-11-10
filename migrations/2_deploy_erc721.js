var erc721 = artifacts.require("./ERC721.sol");

module.exports = function(deployer) {
  deployer.deploy(erc721, "ipfstoken", "itk");;
};
