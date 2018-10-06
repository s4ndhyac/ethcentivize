import React, { Component } from 'react'
import JiraContract from '../build/contracts/JiraContract.json'
import getWeb3 from './utils/getWeb3'
import contract from 'truffle-contract'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import { Jumbotron, Container, Button, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Nav, Collapse, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'

class App extends Component {
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

    this.bountyContract.setProvider(this.state.web3.currentProvider)
    // Declaring this for later so we can chain functions on bountyContract.

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.jiraContract.deployed().then(() => {
        this.setState({ account: accounts[0] });
      })
    })
  }

  render() {
    return (
      <div className="App">
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
        <Jumbotron fluid>
          <Container fluid>
            <h1 className="display-3 text-center">ETHcentivize</h1>
            <p className="lead text-center">An Incentivized Issue Tracker</p>
            <p className="lead text-center">Most problems in software development are problems of incentive</p>
            <hr className="my-4" />
          </Container>
        </Jumbotron>
        <Row>
          <Col lg="4">
            <h2 className="text-center">Create</h2>
            <p className="text-center" id="text-desc">As a product manager, create a Feature request. File a Bug. Raise a Support Ticket. Add a description. Set the Reward ETH. Incentivize your developers to solve the right issues, at the right time and fast.</p>
            <p className="text-center" ><Button size="lg" id="pure-button-primary"><Link to="/create" >Create</Link></Button></p>
          </Col>
          <Col lg="4">
            <h2 className="text-center">Browse</h2>
            <p className="text-center" id="text-desc">As a developer, check your assigned issues. Knock off issues to get rewarded ETH. Add an Additional source of income to your salary for that extra night on the town.</p>
            <p className="text-center"><Button id="pure-button-primary" size="lg"><Link to="/browse">Browse</Link></Button></p>
          </Col>
          <Col lg="4">
            <h2 className="text-center">Dashboard</h2>
            <p className="text-center" id="text-desc">Check your rewards. Withdraw rewards credited to your account. Check your account's current balance. Analyze your performance.</p>
            <p className="text-center"><Button id="pure-button-primary" size="lg"><Link to="/dashboard">Dashboard</Link></Button></p>
          </Col>
        </Row>
      </div >
    );
  }
}

export default App
