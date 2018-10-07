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
  CardTitle, CardText, Col, Label, Input, FormGroup
} from 'reactstrap'
import { Link } from 'react-router-dom'


class Browse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      account: null,
      issues: []
    }
    this.jiraContract = contract(JiraContract)
  }

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
        this.getIssues()
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



  getIssues() {
    var jiraContractInstance;
    this.jiraContract.deployed().then((instance) => {
      jiraContractInstance = instance;
      var issuesCreated = []
      jiraContractInstance.returnIssuesCount().then((numIssues) => {
        for (var i = 0; i < numIssues.valueOf(); i++) {
          jiraContractInstance.getIssue.call(i, { from: this.state.account }).then((issue) => {
            issuesCreated.push(issue)
            this.setState({ issues: issuesCreated })
          })
        }
      })
    })
  }

  startWork(issueId) {
    var jiraContractInstance;
    this.jiraContract.deployed().then((instance) => {
      jiraContractInstance = instance;
      return jiraContractInstance.createRepoIssue(issueId, { from: this.state.account }).then((value) => {
        console.log(value.valueOf())
        var messageKey = "message_" + issueId
        document.getElementById(messageKey).innerHTML = "Success"
      }).catch((error) => {
        console.log(error)
      })
    })
  }


  createCard(issue, index) {
    console.log(issue);
    var issueType = issue[0].valueOf() == 0 ? "Feature" : issue[0].valueOf() == 1 ? "Bug" : "Support"
    var issueStage = issue[4].valueOf() == 0 ? "Open" : "Closed"
    return (
      <Card key={"issueId_" + index}>
        <CardHeader tag="h3">{issueType + " || " + issueStage}</CardHeader>
        <CardBody>
          <CardTitle tag="h4">Issue Description</CardTitle>
          <CardText className="lead">{issue[2]}</CardText>
          <hr />
          {issue[1].valueOf() == this.state.account && issue[4].valueOf() == 0 ? (
            <div>
              <Button onClick={() => this.startWork(index)}>Start Work</Button>
            </div>
          ) : null}
        </CardBody>
        <CardFooter tag="h3">{"Reward: " + this.state.web3.fromWei(issue[3].valueOf(), "ether") + " ETH"}</CardFooter>
        {/* <p key={"p_" + index} className="p" id={"message_" + index}></p> */}
      </Card>
    )
  }


  render() {
    return (
      <div className="Browse">
        <div className="navbar-wrapper">
          <Navbar expand="md" className="navbar-fixed-top">
            <NavbarBrand href="./" className="mr-xl-5 h-25" id="navbar-header">ETHcentivize</NavbarBrand>
            <NavbarToggler />
            <Collapse navbar>
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
        <h1 className="m-md-5">Browse</h1>
        <div>
          {this.state.issues.map((issue, index) => { return this.createCard(issue, index) })}
        </div>
      </div >
    );
  }
}

export default Browse
