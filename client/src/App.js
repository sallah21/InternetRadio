import React, { Component } from 'react';
import './App.css';
import Top from './Top';
import Player from './Player';
class App extends Component {
state = {
    data: null,
    title: null,
    desc : null,
    adminMode: false,
    token: null
  };

  componentDidMount() {
    this.callBackendAPI()
      .then(res => this.setState({ title: res.title, desc: res.desc}))
      .catch(err => console.log(err));
  }
    // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/data');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  render() {
    return (
      <div className="App">
        <Top></Top>
        <p className="App-title">{this.state.title}</p>
        <p className="App-desc">{this.state.desc}</p>
        <Player></Player>
      </div>
    );
  }
}

export default App;
