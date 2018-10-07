pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/payment/PullPayment.sol";
import "chainlink/solidity/contracts/Chainlinked.sol";

contract JiraContract is Chainlinked, PullPayment {

  address private owner;

  constructor() public {
    owner = msg.sender;
    setLinkToken(0x01BE23585060835E02B77ef475b0Cc51aA1e0709);
    setOracle(0xf18455e70984e8fda0ADbe2c8dD21509DBeFA218);
  }

  enum IssueStage {
    Open,
    InProgress,
    Closed
  }

  enum IssueType {
    Feature,
    Bug,
    Support
  }

  struct Issue {
    uint32 issueId;
    IssueType issueType;
    address assigner;
    address assignee;
    string desc;
    uint256 rewardAmt;
    string repositoryOwner;
    string repositoryName;
    IssueStage issueStage;
    string repoIssueId;
  }

  mapping (uint32 => Issue) issues;
  uint32 numIssues;

  function createIssue(IssueType issueType, address assignee, string desc, uint256 rewardAmt, string repositoryOwner, string repositoryName) public returns(uint32) {
    issues[numIssues] = Issue(numIssues, issueType, msg.sender, assignee, desc, rewardAmt, repositoryOwner, repositoryName, IssueStage.Open, "");
    numIssues++;
    return numIssues;
  }

  function returnIssuesCount() public view returns (uint32) {
    return numIssues;
  }

  function getIssue(uint32 issueId) public view returns(uint, address, string, uint256, string, string, uint, string) {
    return (uint(issues[issueId].issueType), issues[issueId].assignee, issues[issueId].desc, issues[issueId].rewardAmt, issues[issueId].repositoryOwner, issues[issueId].repositoryName, uint(issues[issueId].issueStage), issues[issueId].repoIssueId);
  }

  function strConcat(string _a, string _b, string _c, string _d, string _e) internal returns (string){
    bytes memory _ba = bytes(_a);
    bytes memory _bb = bytes(_b);
    bytes memory _bc = bytes(_c);
    bytes memory _bd = bytes(_d);
    bytes memory _be = bytes(_e);
    string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
    bytes memory babcde = bytes(abcde);
    uint k = 0;
    for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
    for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
    for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
    for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
    for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
    return string(babcde);
}

  function strConcat(string _a, string _b, string _c, string _d) internal returns (string) {
      return strConcat(_a, _b, _c, _d, "");
  }

  function strConcat(string _a, string _b, string _c) internal returns (string) {
      return strConcat(_a, _b, _c, "", "");
  }

  function strConcat(string _a, string _b) internal returns (string) {
      return strConcat(_a, _b, "", "", "");
  }

  function createRepoIssue(string repositoryName, string repository) public payable {
    bytes32 constant jobId = bytes32("cde8428b99b343d294d395853af86441");
    ChainlinkLib.Run memory run = newRun(jobId, this, "createRepoIssueCallback(bytes32, string)");
    run.add("url", strConcat("https://api.github.com/repos",repositoryOwner,repositoryName,"issues"));

    string[] memory path = new string[](1);
    path[0] = _currency;
    run.addStringArray("path", path);
    requestId = chainlinkRequest(run, LINK(1));
  }

  function createRepoIssueCallback(bytes32 _requestId, string repoIssueId) public checkChainlinkFulfillment(_requestId) {

  }

  function getIssueStage(string repoIssueId) public payable returns(uint) {
    bytes32 constant jobId = bytes32("8572b8d42abe4ebfa059e8f5b1500b9f");
    ChainlinkLib.Run memory run = newRun(jobId, this, "requestedDataCallback(bytes32, string)");
    run.add("url", strConcat("https://api.github.com/repos",repositoryOwner,repositoryName,"pulls",repoIssueId));

    string[] memory path = new string[](1);
    path[0] = _currency;
    run.addStringArray("path", path);
    requestId = chainlinkRequest(run, LINK(1));
  }

  function requestedDataCallback(bytes32 _requestId, string issueStage) public checkChainlinkFulfillment(_requestId) {
    
  }

  function creditTransfer() public payable {
    asyncTransfer(dest, amount);
  }

  function checkReward(address assignee) public view returns(uint256) {
    return payments(assignee);
  }

  function withdrawReward() public {
    withdrawPayments();
  }       
}