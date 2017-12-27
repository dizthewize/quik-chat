import React, { Component } from 'react';
import "../css/index.css";
import Home from './Home';

const Hello = () => <h2>Hello</h2>

class App extends Component {
  render() {
    return (
      <div className='container'>
        <Home title="Quik-Chat"/>
      </div>
    );
  }
}

export default App;
