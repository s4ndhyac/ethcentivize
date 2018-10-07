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
      account: null
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
    console.log(document.getElementById("issueType"))
    var issueType = document.getElementById("issueType").value == "Feature" ? 0 : document.getElementById("issueType").value == "Bug" ? 1 : 2;
    var issueDesc = document.getElementById("issue").value;
    var issueReward = document.getElementById("issueReward").value;
    var assignee = document.getElementById("assigneeAddress").value;
    var repoOwner = document.getElementById("repoOwner").value;
    var repoName = document.getElementById("repositoryName").value;
    var issueRewardInWei = this.state.web3.toWei(issueReward, "ether")
    var jiraContractInstance;
    this.jiraContract.deployed().then((instance) => {
      jiraContractInstance = instance;
      return jiraContractInstance.createIssue(issueType, assignee, issueDesc, issueRewardInWei, repoOwner, repoName, { from: this.state.account })
    }).then((value) => {
      console.log(value.valueOf());
      document.getElementById("message").innerHTML = "Success"
      document.getElementById("issue").value = ""
      document.getElementById("issueReward").value = ""
      document.getElementById("issueType").value = ""
      document.getElementById("assigneeAddress").value = ""
      document.getElementById("repoOwner").value = ""
      document.getElementById("repositoryName").value = ""
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
        <h1 className="m-md-5">Create Issue</h1>
        <div>
          <Form>
            <FormGroup row>
              <Col sm={1}>
                <Label for="issue" sm={1} size="lg">Issue Type</Label>
              </Col>
              <Col sm={8}>
                <Input type="select" size="lg" name="select" id="issueType">
                  <option>Feature</option>
                  <option>Bug</option>
                  <option>Support</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={1}>
                <Label for="issue" sm={1} size="lg">Issue</Label>
              </Col>
              <Col sm={8}>
                <Input type="textarea" name="text" id="issue" placeholder="Describe the Issue" bsSize="lg" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={1}>
                <Label for="issueReward" sm={1} size="lg">Reward</Label>
              </Col>
              <Col sm={8}>
                <Input type="reward" name="reward" id="issueReward" placeholder="Enter Reward in ETH" bsSize="lg" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={1}>
                <Label for="issue" sm={1} size="lg">Assignee</Label>
              </Col>
              <Col sm={8}>
                <Input type="address" name="address" id="assigneeAddress" placeholder="Assignee Address" bsSize="lg" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={1}>
                <Label for="issue" sm={1} size="lg">Repository Account</Label>
              </Col>
              <Col sm={8}>
                <Input type="owner" name="owner" id="repoOwner" placeholder="Repository Account" bsSize="lg" />
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
            <p className="m-md-5"><Button size="lg" onClick={() => this.createIssue()}>Submit</Button></p>
            <p className="p" id="message"></p>
          </Form>
        </div>
      </div >
    );
  }
}

export default Create
