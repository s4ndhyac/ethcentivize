import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import JiraContract from '../build/contracts/JiraContract.json'
import contract from 'truffle-contract'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import { Button, Form, FormGroup, Label, Input, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Nav, Collapse, Col } from 'reactstrap'
import { Link } from 'react-router-dom'


class Create extends Component {

  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      account: null,
      isStopped: false
    }
    this.jiraContract = contract(JiraContract)
    this.createIssue = this.createIssue.bind(this)
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

  createIssue() {
    var bountyDesc = document.getElementById("bountyProblem").value;
    var bountyReward = document.getElementById("bountyReward").value;
    var bountyRewardInWei = this.state.web3.toWei(bountyReward, "ether")
    var jiraContractInstance;
    this.jiraContract.deployed().then((instance) => {
      jiraContractInstance = instance;
      return jiraContractInstance.createBounty(bountyDesc, bountyRewardInWei, { from: this.state.account })
    }).then((value) => {
      console.log(value.valueOf());
      document.getElementById("message").innerHTML = "Success"
      document.getElementById("bountyProblem").value = ""
      document.getElementById("bountyReward").value = ""
    }).catch((error) => {
      console.log(error)
    })
  }


  render() {
    return (
      <div className="Create">
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
        <h1 className="m-md-5">Create Issue</h1>
        <div>
          <Form>
            <FormGroup row>
              <Col sm={1}>
                <Label for="bountyProblem" sm={1} size="lg">Problem Description</Label>
              </Col>
              <Col sm={8}>
                <Input type="textarea" name="text" id="bountyProblem" placeholder="Enter Problem Statement for Bounty Program" bsSize="lg" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={1}>
                <Label for="bountyReward" sm={1} size="lg">Reward</Label>
              </Col>
              <Col sm={8}>
                <Input type="reward" name="reward" id="bountyReward" placeholder="Enter Bounty Reward in ETH" bsSize="lg" />
              </Col>
            </FormGroup>
            <p className="m-md-5"><Button size="lg" onClick={() => this.createBounty()} disabled={this.state.isStopped}>Submit</Button></p>
            <p className="p" id="message"></p>
          </Form>
        </div>
      </div >
    );
  }
}

export default Create
