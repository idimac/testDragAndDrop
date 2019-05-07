import React from 'react';
import DraggableList from './DraggableList';
import './App.css';

import { availableColumns, visibleColumns, numberFixed } from './utils/columns';

import 'bootstrap/dist/css/bootstrap.min.css';


class App extends React.Component {
  state = {
    cols: [],
    visCols: [],
  }

  componentDidMount () {
    setTimeout( ()=>{
      this.setState({
        cols: availableColumns,
        visCols: visibleColumns,
        count: numberFixed,
      })
    },1000)
  }

  render() {
    const { cols, visCols, count } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>Configure Data Fields</h1>
          <p className="Subheader">Drag & drop beetwen columns to configure visible data</p>
        </header>
        <div className="mainPage">
          <DraggableList availableColumns={cols} visibleColumns={visCols} numberFixed={count} /> 
        </div>
        
      </div>
    );
  }
}

export default App;
