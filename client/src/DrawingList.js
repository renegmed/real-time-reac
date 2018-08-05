import React, { Component } from 'react';
import { subscribeToDrawings } from './api';

class DrawingList extends Component {
    constructor(props) {
        super(props);

        subscribeToDrawings( (drawing) => {         // call the function passing anonymous function with drawing parameter
            this.setState(prevState => ({           // this receives data from server
                drawings: prevState.drawings.concat([drawing]),  // add individual drawing into array
            }));
        });
    }

    state = {
        drawings: [] ,
    };
 

    render() {
        // onclick calls a function selectDrawing defined in App.js
        const drawings = this.state.drawings.map( drawing => {
            return(
                <li
                    className="DrawingList-item"
                    key={drawing.id}
                    onClick={ event => {this.props.selectDrawing(drawing) } }                    
                >
                {drawing.name}
                </li>
            );
        });
        return (
            <ul 
                className="DrawingList"
            >
            {drawings}
            </ul>
        );
    };
}

export default DrawingList