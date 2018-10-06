import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import JiraContract from '../build/contracts/JiraContract.json'
import contract from 'truffle-contract'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import {
  Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Nav, Collapse, Card, Button, CardHeader, CardFooter, CardBody,
  CardTitle, CardText, Col, Row, ListGroup, ListGroupItem, Badge
} from 'reactstrap'
import { Link } from 'react-router-dom'


class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      account: null
      // allBounties: [],
      // solutions: {},
      // flipStatus: {},
      // solutionSelected: {},
      // solutionAccepted: {},
      // showMyContracts: true,
      // bountyHunterSolutions: {},
      // isHunter: false,
      // isStopped: false
    }
    this.jiraContract = contract(JiraContract)
    //this.toggle = this.toggle.bind(this);
  }


  // solutionSelectedState(bountyId, solutionId) {
  //     const currentSolutionsSelected = [...this.state.solutionSelected]
  //     currentSolutionsSelected[bountyId] = solutionId
  //     this.setState({ solutionSelected: currentSolutionsSelected })
  // }

  // solutionAcceptedState(bountyId, solutionId) {
  //     const currentSolutionsAccepted = [...this.state.solutionAccepted]
  //     currentSolutionsAccepted[bountyId] = solutionId
  //     this.setState({ solutionAccepted: currentSolutionsAccepted })
  // }

  // toggle(index) {
  //     const newflipStatus = [...this.state.flipStatus]
  //     newflipStatus[index] = !this.state.flipStatus[index]
  //     this.setState({ flipStatus: newflipStatus })
  //     this.getSolutions(index)
  // }

  // toggleView(showMyContractsBool) {
  //     this.setState({ showMyContracts: showMyContractsBool })
  //     if (!showMyContractsBool)
  //         this.state.allBounties.map((bounty, index) => this.getSolutions(index))
  // }

  componentWillMount() {

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        this.instantiateContract()
      })
      .catch(() => {
        console.log('Error finding web3.')
      }).then(() => {
        this.getAllBounties()
      })
  }

  instantiateContract() {

    this.jiraContract.setProvider(this.state.web3.currentProvider)
    // Declaring this for later so we can chain functions on bountyContract.

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.jiraContract.deployed().then(() => {
        this.setState({ account: accounts[0] });
      })
    })
  }

  // getAllBounties() {
  //   var bountyContractInstance;
  //   this.bountyContract.deployed().then((instance) => {
  //     bountyContractInstance = instance;
  //     var bountiesCreated = []
  //     bountyContractInstance.returnBountiesCount().then((numBounties) => {
  //       for (var i = 0; i < numBounties.valueOf(); i++) {
  //         bountyContractInstance.getBounty.call(i, { from: this.state.account }).then((bounty) => {
  //           bountiesCreated.push(bounty)
  //           this.setState({ allBounties: bountiesCreated })
  //         })
  //       }
  //     })
  //   })
  // }

  // getSolutions(bountyId) {
  //   var bountyContractInstance;
  //   this.bountyContract.deployed().then((instance) => {
  //     bountyContractInstance = instance;
  //     var solutionsSubmitted = []
  //     var mySolutions = []
  //     bountyContractInstance.returnSolutionsCount(bountyId).then((numSolutions) => {
  //       for (var i = 0; i < numSolutions.valueOf(); i++) {
  //         bountyContractInstance.getSolution.call(bountyId, i, { from: this.state.account }).then((solution) => {
  //           solutionsSubmitted.push(solution)
  //           const updatedSolutions = [...this.state.solutions]
  //           updatedSolutions[bountyId] = solutionsSubmitted
  //           this.setState({ solutions: updatedSolutions })
  //           if (solution[0] == this.state.account) {
  //             this.setState({ isHunter: true })
  //             mySolutions.push(solution)
  //             const updatedMySolutions = [...this.state.bountyHunterSolutions]
  //             updatedMySolutions[bountyId] = mySolutions
  //             this.setState({ bountyHunterSolutions: updatedMySolutions })
  //           }
  //           if (solution[2])
  //             this.solutionAcceptedState(bountyId, i)
  //         })
  //       }
  //     }).catch((error) => {
  //       console.log(error)
  //     })
  //   })
  // }


  // createSolutionItem(solution, solutionId, bountyId) {
  //   console.log(solution)
  //   var solutionState = solution[2] ? "Accepted" : ""
  //   return (
  //     <ListGroupItem key={"item_" + bountyId + "_" + solutionId} tag="button" onClick={() => this.solutionSelectedState(bountyId, solutionId)} active={this.state.solutionSelected[bountyId] === solutionId}>{solution[1]}<Badge size="lg" color="secondary">{solutionState}</Badge></ListGroupItem>
  //   )
  // }

  // createSolutionItemForHunter(solution, solutionId, bountyId) {
  //   var solutionState = solution[2] ? "Accepted" : "Not Accepted"
  //   return (

  //     <ListGroupItem key={"item_" + bountyId + "_" + solutionId} >{solution[1]}<Badge size="lg" color="secondary">{solutionState}</Badge></ListGroupItem>

  //   )
  // }

  // acceptSolution(bountyId, solutionId) {
  //   var bountyContractInstance
  //   this.bountyContract.deployed().then((instance) => {
  //     bountyContractInstance = instance
  //     bountyContractInstance.getSolutionToBeAwarded(bountyId, solutionId, { from: this.state.account }).then((result) => {
  //       var rewardInWei = result[1].valueOf()
  //       bountyContractInstance.untrustedAcceptSolution(bountyId, solutionId, { from: this.state.account, value: rewardInWei }).then((value) => {
  //         console.log(value.valueOf())
  //         document.getElementById("message_" + bountyId).innerHTML = "Success"
  //         this.toggle(bountyId)
  //       }).then(() => {
  //         setTimeout(function () { window.location.reload() }, 3000);
  //       })
  //     })

  //   })
  // }


  pullReward() {
    if (this.state.isHunter) {
      var jiraContractInstance
      this.jiraContract.deployed().then((instance) => {
        jiraContractInstance = instance
        jiraContractInstance.withdrawReward({ from: this.state.account, gas: 3000000 }).then((value) => {
          console.log(value)
        }).catch((error) => {
          console.log(error)
        })
      })
    }
    else {
      document.getElementById("transfer").innerHTML = "No Credit to withdraw"
    }
  }

  // checkWinnings() {
  //   if (this.state.isHunter) {
  //     var hunterAddress = this.state.account
  //     var bountyContractInstance
  //     this.bountyContract.deployed().then((instance) => {
  //       bountyContractInstance = instance
  //       bountyContractInstance.untrustedCheckBountyWinnings(hunterAddress, { from: this.state.account }).then((value) => {
  //         console.log(value)
  //         document.getElementById("credited").innerHTML = this.state.web3.fromWei(value.valueOf(), "ether") + " ETH"
  //       }).catch((error) => {
  //         console.log(error)
  //       })
  //     })
  //   }
  //   else {
  //     document.getElementById("credited").innerHTML = "0"
  //   }

  // }


  // createMyBountiesCard(bounty, index) {
  //   if (bounty[0] == this.state.account) {
  //     var bountyStage = bounty[3].valueOf() == 0 ? "Open" : bounty[3].valueOf() == 1 ? "Closed" : "Invalid State"

  //     return (
  //       <div key={"div_" + index}>
  //         <Card key={"bountyId_" + index}>
  //           <CardHeader tag="h3">{bountyStage}</CardHeader>
  //           <CardBody>
  //             <CardTitle tag="h4">Problem Statement</CardTitle>
  //             <CardText className="lead">{bounty[1]}</CardText>
  //             <Button onClick={() => this.toggle(index)}>View Solution</Button>
  //             <Collapse isOpen={this.state.flipStatus[index]}>
  //               <Card>
  //                 <CardBody>
  //                   <ListGroup>
  //                     {
  //                       (typeof this.state.solutions[index] !== "undefined") ?
  //                         this.state.solutions[index].map((solution, solutionId) => { return this.createSolutionItem(solution, solutionId, index) })
  //                         : null
  //                     }
  //                   </ListGroup>
  //                   {((typeof this.state.solutions[index] !== "undefined") && (typeof this.state.solutionAccepted[index] === "undefined")) ? (
  //                     <Button key={"accept_" + index} onClick={() => this.acceptSolution(index, this.state.solutionSelected[index])} disabled={this.state.isStopped}>Click to Accept Selected Solution</Button>
  //                   ) : null}
  //                 </CardBody>
  //               </Card>
  //             </Collapse>
  //           </CardBody>
  //           <CardFooter tag="h3">{"Reward: " + this.state.web3.fromWei(bounty[2].valueOf(), "ether") + " ETH"}</CardFooter>
  //           <p key={"p_" + index} className="p" id={"message_" + index}></p>
  //         </Card>
  //         <br />
  //       </div>
  //     )
  //   }
  // }

  // createMySolutionsCard(bounty, index) {
  //   if (typeof this.state.bountyHunterSolutions[index] !== "undefined") {
  //     var bountyStage = bounty[3].valueOf() == 0 ? "Open" : bounty[3].valueOf() == 1 ? "Closed" : "Invalid State"
  //     return (
  //       <div key={"div_sol_" + index}>
  //         <Card key={"card_sol_" + index}>
  //           <CardHeader tag="h3">{bountyStage}</CardHeader>
  //           <CardBody>
  //             <CardTitle tag="h4">Problem Statement</CardTitle>
  //             <CardText className="lead">{bounty[1]}</CardText>
  //             <ListGroup>
  //               {
  //                 (typeof this.state.bountyHunterSolutions[index] !== "undefined") ?
  //                   this.state.bountyHunterSolutions[index].map((solution, solutionId) => { return this.createSolutionItemForHunter(solution, solutionId, index) })
  //                   : null
  //               }
  //             </ListGroup>
  //           </CardBody>
  //           <CardFooter tag="h3">{"Reward: " + this.state.web3.fromWei(bounty[2].valueOf(), "ether") + " ETH"}</CardFooter>
  //         </Card>
  //         <br />
  //       </div>
  //     )
  //   }
  // }

  getBalance() {
    this.state.web3.eth.getBalance(this.state.account, (err, balance) => {
      this.balance = this.state.web3.fromWei(balance, "ether") + " ETH"
      document.getElementById("balance").innerHTML = this.balance
    });
  }


  // showMyContractsWidgetView() {
  //   if (this.state.showMyContracts)
  //     return this.state.allBounties.map((bounty, index) => { return this.createMyBountiesCard(bounty, index) })
  //   else {
  //     return (
  //       <div>
  //         <Row>
  //           <Col>
  //             <Button color="secondary" onClick={() => this.checkWinnings()}>Winnings Available</Button>
  //           </Col>
  //           <Col>
  //             <p className="psize" id="credited"></p>
  //           </Col>
  //         </Row><hr />
  //         <Row>
  //           <Col>
  //             <Button color="secondary" onClick={() => this.pullReward()}>Withdraw Winnings</Button>
  //           </Col>
  //           <Col>
  //             <p className="psize" id="transfer"></p>
  //           </Col>
  //         </Row><hr />
  //         <Row>
  //           <Col>
  //             <Button color="secondary" onClick={() => this.getBalance()}>Get Balance</Button>
  //           </Col>
  //           <Col>
  //             <p className="psize" id="balance"></p>
  //           </Col>
  //         </Row><hr />
  //         {this.state.allBounties.map((bounty, index) => { return this.createMySolutionsCard(bounty, index) })}
  //       </div>
  //     )
  //   }
  // }


  render() {
    return (
      <div className="Dashboard">
        <div className="navbar-wrapper">
          <Navbar expand="md" className="navbar-fixed-top">
            <NavbarBrand href="./" className="mr-xl-5 h-25" id="navbar-header">ETHcentivize</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav navbar>
                <NavItem className="mr-xl-5 h-25">
                  <NavLink><Link to="/create">Create</Link></NavLink>
                </NavItem>
                <NavItem className="mr-xl-5 h-25">
                  <NavLink><Link to="/browse">Browse</Link></NavLink>
                </NavItem>
                <NavItem className="mr-xl-5 h-25">
                  <NavLink><Link to="/dashboard">Dashboard</Link></NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
        <h1 className="m-md-5">Dashboard</h1>
        <div className="container-fluid">
          <Row>
            <Col className="col-sm-2 sidebar">
              <Nav vertical>
                {/* <NavItem><NavLink id="navbar-vertical" href="#" onClick={() => this.toggleView(true)} active>My Bounties</NavLink></NavItem>
                <NavItem><NavLink id="navbar-vertical" href="#" onClick={() => this.toggleView(false)}>My Submissions</NavLink></NavItem> */}
              </Nav>
            </Col>
            <Col className="col-sm-10">
              <div id="widgetview">
                {/* {this.showMyContractsWidgetView()} */}
              </div>
            </Col>
          </Row>
        </div>
      </div >
    );
  }
}

export default Dashboard
