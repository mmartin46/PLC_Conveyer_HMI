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
        this.data = props.data;

        this.showLights = this.showLights.bind(this);
    }


    connectToPLC = async () => {
        try {
            const response = await fetch(String(this.api), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data : this.data })
            });

            console.log(JOSN.stringify({ data : this.data }));

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