pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/payment/PullPayment.sol";
import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

contract JiraContract is usingOraclize, PullPayment {

  address private owner;

  constructor() public {
    owner = msg.sender;
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
    string solution;
  }

  mapping (uint32 => Issue) issues;
  mapping (address => uint) assigneeNumJobs;
  mapping (address => mapping(uint => uint32)) assigneeJobs;
  uint32 numIssues;

  event CreateIssue(uint32 issueId, address assignee);
  event CreateRepoIssue(uint32 IssueId, address assigner);
  event AcceptRepoIssue(uint32 IssueId, address assignee);

  /**
   * @dev Create a new issue
   * @param _issueType What is the type of the issue, feature or bug or support
   * @param _assignee The address of the person assigned the job
   * @param _desc The description of the job
   * @param _rewardAmt The reward from completing the job, in Wei
   */
  function createIssue(IssueType _issueType, address _assignee, string _desc, uint256 _rewardAmt) public returns(uint32) {
    issues[numIssues] = Issue(_numIssues, _issueType, msg.sender, _assignee, _desc, _rewardAmt, "");
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
  function getIssue(uint32 _issueId) public view returns(uint, address, address, string, uint256, string) {
    return (uint(issues[_issueId].issueType), issues[_issueId].assigner, issues[_issueId].assignee, issues[_issueId].desc, issues[_issueId].rewardAmt, uint(issues[_issueId].solution));
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
   * @dev Solution for the issue
   * @param _issueId The id number of the issue to link github actions to
   * @param _solution The http location of the solution
   */
  function createRepoIssue(uint32 _issueId, string _solution) public payable {
    require(issues[_issueId].assignee == msg.sender);
    emit CreateRepoIssue(_issueId, issues[_issueId].assigner);
    issues[_issueId].solution = _solution;
  }

  /**
   * @dev Accept function for the stage of an issue
   * @param _issueId Id number of the issue
   */
  function acceptRepoIssue(uint32 _issueId) public payable {
    emit AcceptRepoIssue(_issueId, issues[_issueId].assignee);
    creditTransfer(issues[_issueId].assignee, issues[_issueId].amount);
  }

  /**
   * @dev Payment function
   */
  function creditTransfer(address _payee, uint32 _amount) public payable {
    asyncTransfer(_payee, _amount);
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
