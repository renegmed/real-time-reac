import React, { Component } from 'react';
import Canvas from 'simple-react-canvas';
import { publishLine } from './api';

class Drawing extends Component {

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
                />
            </div>    

        ) : null;

    }
}

export default Drawing;

