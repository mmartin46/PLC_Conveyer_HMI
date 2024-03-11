
import './TestButton.css'

function TestButton(props) {
    return <div><h6 onClick={() => props.onClick()}>{props.title}</h6></div>;
};

export default TestButton;