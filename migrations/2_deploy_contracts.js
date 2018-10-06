var JiraContract = artifacts.require("./JiraContract.sol");

module.exports = function (deployer) {
  deployer.deploy(JiraContract);
};