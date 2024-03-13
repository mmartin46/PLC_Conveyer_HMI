import { Component } from "react";
import TestButton from "./TestButton";


class TestScriptButton extends Component {

    constructor(props) {
        super(props)

        this.state = {
            title : 'Test Lights'
        };

        this.showLights = this.showLights.bind(this);
    }


    connectToPLC = async () => {
        try {
            const response = await fetch('http://localhost:5000/display-lights');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
        } catch (error) {
            console.log('Failed to display lights', error);
        }
    }

    showLights = async () => {
        await this.connectToPLC();
    }

    render() {
        const { title } = this.state; 

        return (<TestButton
            title={title}
            onClick={this.showLights}
        />);
    }
};
export default TestScriptButton;