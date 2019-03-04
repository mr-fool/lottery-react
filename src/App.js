import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import getWeb3 from "./web3";
import contractData from "./lottery";
import Web3 from "web3";
const web3 = new Web3(window.web3.currentProvider);

class App extends Component {
  state = {
    manager: "",
     web3: {}, 
     lottery: {},
     players: [],
     balance: '',
     value: ''
  };
  async componentDidMount() {
    console.log(contractData);
    const { web3 } = await getWeb3;
    const lottery = new web3.eth.Contract(
      contractData.abi,
      contractData.address
    );

    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, web3, lottery,players, balance });
  }
 
  onSubmit = async (event) => {
    event.preventDefault();
    const lottery = new web3.eth.Contract(
      contractData.abi,
      contractData.address
    );
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}.
          There are currently {this.state.players.length} people entered,
          competiting to win { web3.utils.fromWei(this.state.balance, 'ether') } ether! 
          </p>
      <hr/>
      <form onSubmit={this.onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input 
            value={this.state.value}
            onChange={event => this.setState({value: event.target.value})}
          />
        </div>
        <button>Enter</button>
      </form>
      </div>
    );
  }
}

export default App;
