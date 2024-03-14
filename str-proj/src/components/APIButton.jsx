import { Component } from "react";
import TestButton from "./TestButton";


class APIButton extends Component {

    constructor(props) {
        super(props)

        this.state = {
            title : 'Test Lights'
        };

        this.api = props.api;
        this.failMessage = props.failMessage;
        this.catchMessage = props.catchMessage;

        this.showLights = this.showLights.bind(this);
    }


    connectToPLC = async () => {
        try {
            const response = await fetch(String(this.api));
            if (!response.ok) {
                throw new Error(String(this.failMessage));
            }

            const data = await response.json();
        } catch (error) {
            console.log(String(this.catchMessage), error);
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
export default APIButton;