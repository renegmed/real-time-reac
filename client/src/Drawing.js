import React, { Component } from 'react';
import Canvas from 'simple-react-canvas';
import { publishLine, subscribeToDrawingLines } from './api';

class Drawing extends Component {
    state = {
        lines: [],
    };

    componentDidMount() {
        subscribeToDrawingLines(this.props.drawing.id, (linesEvent) => {
            this.setState( (prevState) => {  // prevState is the current state that will be modified
                return {
                    lines : [...prevState.lines, ...linesEvent.lines]  // new line is added to previous array of lines to form a new array of lines
                }
            });
        });
    }

    // publishLine() is defined in api.js that emits drawing points (line) to server
    // and save to thinkdb table 'lines'
    handleDraw = (line) => {
        publishLine({
            drawingId: this.props.drawing.id,
            line,
        });
    }

    // if Drawing is empty, don't display this Drawing element
    render() {
        return (this.props.drawing) ? (
            <div 
                className="Drawing"
            >
                <div className="Drawing-title">{this.props.drawing.name}</div>
                <Canvas 
                    drawingEnabled={true} 
                    onDraw={this.handleDraw}
                    lines={this.state.lines}    
                />
            </div>    

        ) : null;

    }
}

export default Drawing;

