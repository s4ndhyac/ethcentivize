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
  CardTitle, CardText, Col, Row, ListGroup, ListGroupItem, Badge, Form, FormGroup, Label, Input
} from 'reactstrap'
import { Link } from 'react-router-dom'


class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      account: null
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

  creditReward() {
    var issueId = document.getElementById("repositoryIssueId").value
    var jiraContractInstance
    this.jiraContract.deployed().then((instance) => {
      jiraContractInstance = instance
      jiraContractInstance.getIssue(issueId, { from: this.state.account }).then((result) => {
        console.log(result)
        var rewardInWei = result[3].valueOf()
        jiraContractInstance.creditTransfer(this.state.account, rewardInWei, { from: this.state.account[1], value: rewardInWei }).then((value) => {
          console.log(value.valueOf())
          document.getElementById("repositoryOwner").innerHTML = ""
          document.getElementById("repositoryName").innerHTML = ""
          document.getElementById("repositoryIssueId").innerHTML = ""
          document.getElementById("message").innerHTML = "Success"
        })
      })
    })
  }


  pullReward() {
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

  checkWinnings() {
    var jiraContractInstance
    this.jiraContract.deployed().then((instance) => {
      jiraContractInstance = instance
      jiraContractInstance.checkReward(this.state.account, { from: this.state.account }).then((value) => {
        console.log(value)
        document.getElementById("credited").innerHTML = this.state.web3.fromWei(value.valueOf(), "ether") + " ETH"
      }).catch((error) => {
        console.log(error)
      })
    })
  }

  getBalance() {
    this.state.web3.eth.getBalance(this.state.account, (err, balance) => {
      this.balance = this.state.web3.fromWei(balance, "ether") + " ETH"
      document.getElementById("balance").innerHTML = this.balance
    });
  }


  render() {
    return (
      <div className="Dashboard">
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
        <h1 className="m-md-5">Dashboard</h1>
        <div className="container-fluid">
          <Row>
            <Col className="col-sm-10">
              <div id="widgetview">
                <div>
                  <Row>
                    <Col>
                      <Button color="secondary" onClick={() => this.checkWinnings()}>Winnings Available</Button>
                    </Col>
                    <Col>
                      <p className="psize" id="credited"></p>
                    </Col>
                  </Row><hr />
                  <Row>
                    <Col>
                      <Button color="secondary" onClick={() => this.pullReward()}>Withdraw Winnings</Button>
                    </Col>
                    <Col>
                      <p className="psize" id="transfer"></p>
                    </Col>
                  </Row><hr />
                  <Row>
                    <Col>
                      <Button color="secondary" onClick={() => this.getBalance()}>Get Balance</Button>
                    </Col>
                    <Col>
                      <p className="psize" id="balance"></p>
                    </Col>
                  </Row>

                </div>
              </div>
            </Col>
          </Row>
          <br /><br />
          <Form>
            <FormGroup row>
              <Col sm={1}>
                <Label for="issue" sm={1} size="lg">Repository Account</Label>
              </Col>
              <Col sm={8}>
                <Input type="repoOwner" name="repoOwner" id="repositoryOwner" placeholder="Repository Account" bsSize="lg" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={1}>
                <Label for="issue" sm={1} size="lg">Repository Name</Label>
              </Col>
              <Col sm={8}>
                <Input type="repoName" name="repoName" id="repositoryName" placeholder="Repository Name" bsSize="lg" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={1}>
                <Label for="issue" sm={1} size="lg">Repository Issue ID</Label>
              </Col>
              <Col sm={8}>
                <Input type="repoIssueId" name="repoIssueId" id="repositoryIssueId" placeholder="Repository Issue ID" bsSize="lg" />
              </Col>
            </FormGroup>
          </Form>
          <p className="m-md-5"><Button size="lg" onClick={() => this.creditReward()}>Complete Work</Button></p>
          <p className="p" id="message"></p>
        </div >
      </div >
    );
  }
}

export default Dashboard
