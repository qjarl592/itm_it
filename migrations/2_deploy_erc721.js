var erc721 = artifacts.require("./ERC721.sol");
//var Purchase = artifacts.require("./Purchase.sol");

module.exports = function(deployer) {
  deployer.deploy(erc721, "ipfstoken", "itk");
  //deployer.deploy(Purchase);
};
