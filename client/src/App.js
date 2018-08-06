import React, { Component } from 'react';
import './App.css';
import DrawingForm from './DrawingForm';
import DrawingList from './DrawingList';
import Drawing from './Drawing';
import Connection from './Connection';


class App extends Component {
  // initialize to null in order to call DrawingForm and DrawingList
  state = {
    selectedDrawing: null
  };

  // this will be called from drawing list page when user selected a drawing
  selectDrawing = (drawing) => {
    this.setState({
      selectedDrawing: drawing
    });
  }

  render() {
    // this is a single page app which a page is determined by ctrl value
    let ctrl = (
      <div>
        <DrawingForm />
        <DrawingList 
          selectDrawing={this.selectDrawing}
        /> 
      </div>         
    );
    // if drawing is selected, display a drawing page
    // else display add/list of drawings page
    if (this.state.selectedDrawing) {
      ctrl = (
        <Drawing
          drawing={this.state.selectedDrawing}
          key={this.state.selectedDrawing.id} 
        />
      );
    }
    return (
      <div className="App">
        <div className="App-header">
          <h2>Our awesome drawing app</h2>
        </div>
        <Connection />
        {ctrl}       
      </div>
    );
  }
}

export default App;
