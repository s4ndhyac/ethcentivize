pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/payment/PullPayment.sol";
import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";
import "chainlink/solidity/contracts/Chainlinked.sol";

contract JiraContract is usingOraclize, PullPayment, Chainlinked {

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
  mapping (address => uint) assigneeNumJobs;
  mapping (address => mapping(uint => uint32)) assigneeJobs;
  uint32 numIssues;

  event CreateIssue(uint32 issueId, address assignee);
  event CreateRepoIssue(uint32 IssueId, address assignee);

  /**
   * @dev Create a new issue
   * @param _issueType What is the type of the issue, feature or bug or support
   * @param _assignee The address of the person assigned the job
   * @param _desc The description of the job
   * @param _rewardAmt The reward from completing the job, in Wei
   * @param _repositoryOwner The repo owner's github id
   * @param _repositoryName The name of the github repo
   */
  function createIssue(IssueType _issueType, address _assignee, string _desc, uint256 _rewardAmt, string _repositoryOwner, string _repositoryName) public returns(uint32) {
    issues[numIssues] = Issue(_numIssues, _issueType, msg.sender, _assignee, _desc, _rewardAmt, _repositoryOwner, _repositoryName, IssueStage.Open, "");
    assigneeJobs[_assignee][devNumJobs] = numIssues;
    devNumJobs[_assignee]++;
    emit CreateIssue(numIssues, _assignee);
    numIssues++;
    return numIssues;
  }

  /**
   * @dev Getter function for number of issues
   */
  function returnIssuesCount() public view returns (uint32) {
    return numIssues;
  }

  /**
   * @dev Getter function for the metadata of an issue
   * @param _issueId The id number of the issue of interest
   */
  function getIssue(uint32 _issueId) public view returns(uint, address, string, uint256, string, string, uint, string) {
    return (uint(issues[_issueId].issueType), issues[_issueId].assignee, issues[_issueId].desc, issues[_issueId].rewardAmt, issues[_issueId].repositoryOwner, issues[_issueId].repositoryName, uint(issues[_issueId].issueStage), issues[_issueId].repoIssueId);
  }

  /**
   * @dev Getter function for the list of jobs for an assignee
   * @param _assignee Address of the assignee of interest
   */
  function getAssigneeIssues(address _assignee) public view returns (uint32[]){
    uint32[] issueIdArr;
    for (uint i = 0; i< assigneeNumJobs[_assignee]; i++){
      issueIdArr[i] = assigneeJobs[_assignee][i];
    }
    return issueIdArr;
  }

  /**
   * @dev TODO
   * @dev Creates the pull request for the repo
   * @param _issueId The id number of the issue to link github actions to
   * @param _repositoryOwner The owner of the github repository
   * @param _repositoryName The name of the github repository
   */
  function createRepoIssue(uint32 _issueId, string _repositoryOwner, string _repositoryName) public payable returns(string) {
    require(issues[_issueId].assignee == msg.sender);
    emit CreateRepoIssue(_issueId);
  }

  // UNSTABLE
  /**
   * @dev TODO
   * @dev Getter function for the stage of an issue
   * @param _repoIssueId Id number of the repo/pull request number
   */
  function getIssueStage(string _repoIssueId) public payable returns(uint) {
    ChainlinkLib.Run memory run = newRun(jobId, this, "requestedDataCallback(string)");
    run.add("url", "https://api.github.com/" + _repositoryOwner + "/" + _repositoryName + "/pull/" + _repoIssueId);
    string[] memory path = new string[](1);
    path[0] = "state"; // "open" or whatever
    run.addStringArray("copyPath", path);
    requestId = chainlinkRequest(run, LINK(1));
  }

  /**
   * @dev Getter function for the stage of an issue
   */
  function creditTransfer() public payable {
    asyncTransfer(dest, amount);
  }

  /**
   * @dev Getter function for payments made to an assignee
   * @param _assignee Address of the assignee to check
   */
  function checkReward(address _assignee) public view returns(uint256) {
    return payments(_assignee);
  }

   /**
   * @dev Function for assignees to withdraw their rewards
   */
  function withdrawReward() public {
    withdrawPayments();
  }



}
