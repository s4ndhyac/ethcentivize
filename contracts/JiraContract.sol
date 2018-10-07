pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/payment/PullPayment.sol";
import "chainlink/solidity/contracts/Chainlinked.sol";

contract JiraContract is Chainlinked, PullPayment{ 

  address private owner;

  constructor() public {
    owner = msg.sender;
    setLinkToken(0x01BE23585060835E02B77ef475b0Cc51aA1e0709);
    setOracle(0xf18455e70984e8fda0ADbe2c8dD21509DBeFA218);
  }

  enum IssueStage {
    Open,
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

  mapping(bytes32 => uint32) public receipts;

  function createIssue(IssueType issueType, address assignee, string desc, uint256 rewardAmt, string repositoryOwner, string repositoryName) public returns(uint32) {
    issues[numIssues] = Issue(numIssues, issueType, msg.sender, assignee, desc, rewardAmt, repositoryOwner, repositoryName, IssueStage.Open, "");
    numIssues++;
    return numIssues;
  }

  function returnIssuesCount() public view returns (uint32) {
    return numIssues;
  }

  function getIssue(uint32 issueId) public view returns(uint, address, string, uint256, uint, address) {
    return (uint(issues[issueId].issueType), issues[issueId].assignee, issues[issueId].desc, issues[issueId].rewardAmt, uint(issues[issueId].issueStage), issues[issueId].assigner);
  }

  function getIssueDevDetails(uint32 issueId) public view returns(string, string, string) {
    return (issues[issueId].repositoryOwner, issues[issueId].repositoryName, issues[issueId].repoIssueId);
  }

  function closeIssue(uint32 issueId) public {
    issues[issueId].issueStage = IssueStage.Closed;
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

  function bytes32ToString(bytes32 x) public view returns (string) {
    bytes memory bytesString = new bytes(32);
    uint charCount = 0;
    for (uint j = 0; j < 32; j++) {
      byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
      if (char != 0) {
        bytesString[charCount] = char;
        charCount++;
      }
    }
    bytes memory bytesStringTrimmed = new bytes(charCount);
    for (j = 0; j < charCount; j++) {
      bytesStringTrimmed[j] = bytesString[j];
    }
    return string(bytesStringTrimmed);
  }

  function createRepoIssue(uint32 issueId) public payable returns (bytes32) {
    bytes32 jobId = bytes32("cde8428b99b343d294d395853af86441");
    ChainlinkLib.Run memory run = newRun(jobId, this, "createRepoIssueCallback(bytes32,bytes32)");
    run.add("url", strConcat("https://api.github.com/repos/",issues[issueId].repositoryOwner,"/",issues[issueId].repositoryName,"/issues"));  
    string[] memory path = new string[](1);
    path[0] = "number";
    run.addStringArray("path", path);
    string memory issueType = uint(issues[issueId].issueType) == 0 ? "enhancement" : (uint(issues[issueId].issueType) == 1) ? "bug" : "question"; 
    run.add("title", issueType);
    run.add("body", issues[issueId].desc);
    string[] memory assignees = new string[](1);
    assignees[0] = issues[issueId].repositoryOwner;
    run.addStringArray("assignees", assignees);
    string[] memory labels = new string[](1);
    labels[0] = issueType;
    run.addStringArray("labels", labels);
    run.add("Content-Type","application/json");
    run.add("Authorization","Basic czRuZGh5YWM6cmFmYTIzNDky");
    chainlinkRequest(run, LINK(1));
  }

  function createRepoIssueCallback(bytes32 _requestId, bytes32 repoIssueId) public checkChainlinkFulfillment(_requestId) {
    issues[receipts[_requestId]].repoIssueId = bytes32ToString(repoIssueId);
  }


  function getIssueStage(string repositoryOwner, string repositoryName, string repoIssueId) public payable returns(uint) {
    bytes32 jobId = bytes32("8572b8d42abe4ebfa059e8f5b1500b9f");
    ChainlinkLib.Run memory run = newRun(jobId, this, "requestedDataCallback(bytes32,bytes32)");
    run.add("url", strConcat(strConcat("https://api.github.com/repos/",repositoryOwner),"/",repositoryName,"/pulls/",repoIssueId));
    string[] memory path = new string[](1);
    path[0] = "message";
    run.addStringArray("path", path);
    chainlinkRequest(run, LINK(1));
  }

  function requestedDataCallback(bytes32 _requestId, bytes32 issueStage) public checkChainlinkFulfillment(_requestId) {
    
  }

  function creditTransfer(address dest, uint256 amount) public payable {
    asyncTransfer(dest, amount);
  }

  function checkReward(address assignee) public view returns(uint256) {
    return payments(assignee);
  }

  function withdrawReward() public {
    withdrawPayments();
  }       
}