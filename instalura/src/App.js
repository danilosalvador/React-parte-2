import React, { Component } from 'react';
import Header from './componentes/Header';
import Timeline from './componentes/Timeline';

class App extends Component {

  render() {
    return (

      <div id="root">
        <div data-reactroot="" className="main">
          <Header/>
          <Timeline login={this.props.login}/>
        </div> 
      </div> 
    );
  }
}

export default App;
