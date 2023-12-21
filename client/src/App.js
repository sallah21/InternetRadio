import React, { Component } from 'react';
import './App.css';
import Top from './Top';
import Player from './Player';
import Dashboard from './Dashboard';
class App extends Component {
state = {
    data: null,
    title: null,
    desc : null,
    adminMode: false,
    token: null
  };

  componentDidMount() {
    // this.callBackendAPI()
    //   .then(res => this.setState({ title: res.title, desc: res.desc}))
    //   .catch(err => console.log(err));
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
        {/* <p className="App-title">{this.state.title}</p>
        <p className="App-desc">{this.state.desc}</p> */}
        {sessionStorage.getItem("isLogged") && <div><Top></Top><Player></Player> <Dashboard/></div>}
        {!sessionStorage.getItem("isLogged") && <div><Top></Top><Player></Player></div>}

      </div>
    );
  }
}

export default App;
