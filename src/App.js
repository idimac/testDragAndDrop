import React from 'react';
import DraggableList from './DraggableList';
import './App.css';

import { availableColumns, visibleColumns, numberFixed } from './utils/columns';

import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Configure Data Fields</h1>
        <p className="Subheader">Drag & drop beetwen columns to configure visible data</p>
      </header>
      <div className="mainPage">
        <DraggableList availableColumns={availableColumns} visibleColumns={visibleColumns} numberFixed={numberFixed} /> 
      </div>
      
    </div>
  );
}

export default App;
