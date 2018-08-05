import React, { Component } from 'react';
import Canvas from 'simple-react-canvas';

class Drawing extends Component {
    // if Drawing is empty, don't display this Drawing element
    render() {
        return (this.props.drawing) ? (
            <div 
                className="Drawing"
            >
                <div className="Drawing-title">{this.props.drawing.name}</div>
                <Canvas drawingEnabled={true} />
            </div>    

        ) : null;

    }
}

export default Drawing;

