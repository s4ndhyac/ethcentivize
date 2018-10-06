pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/payment/PullPayment.sol";
import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

contract JiraContract is usingOraclize, PullPayment {

  address private owner;

  constructor() public {
    owner = msg.sender;
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

  function createRepoIssue(string repositoryName, string repository) public payable returns(string) {

  }

  function getIssueStage(string repoIssueId) public payable returns(uint) {

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