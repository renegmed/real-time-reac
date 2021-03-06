import React, { Component } from 'react';
import { createDrawing } from './api';

class DrawingForm extends Component {
    state = {
        drawingName: '',
    };

    handleSubmit = (event) => {
        event.preventDefault();
        createDrawing(this.state.drawingName);  // this drawing name will be emitted to server
        this.setState({ drawingName: ''});
    }

    render() {
        return (
            <div className="Form" onSubmit={this.handleSubmit}>
                <form>
                    <input 
                        type="text"
                        value={this.state.drawingName}
                        onChange={(evt) => this.setState({
                            drawingName: evt.target.value,
                        })}
                        placeholder="Drawing name"
                        className="Form-drawingInput"
                        required
                    />
                    <button 
                        type="submit"
                        className="Form-drawingInput"
                    >Create</button>
                </form>    
            </div>
        );
    };
}

export default DrawingForm