import Barcode from './Barcode';
import './Roller.css'
import React, { Component } from 'react'

class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conveyerFull: 'N/A',
            scannerOn: 'N/A',
            plcInformation: 'N/A',
            plcPort: 'N/A',
            plcTime: 'N/A'
        };
    }

    componentDidMount() {
        this.getPLCInfo();

        // Reload the status every 500ms.
        this.intervalId = setInterval(this.getPLCInfo, 500);
    }

    // Prevents memory leaks, removed from DOM
    componentWillUnmount() {
        // stops the interval previously set
        clearInterval(this.intervalId);
    }

    async getPLCInfo() {
        try {
            const response = await fetch('http://localhost:5000/get-plc-data');
        
            if (!response.ok) {
                throw new Error('Failed to fetch PLC data');
            }
            const data = await response.json();

            console.log(data)

            // Setting the data.
            this.setState({
                conveyerFull: data['conveyer_full'],
                scannerOn: data['scan_on'],
                plcInformation: data['plc_info'],
                plcPort: data['plc_port'],
                plcTime: data['plc_time']
            }, () => {
                this.forceUpdate();
            });
        } catch (error) {
            console.error('Error fetching PLC data', error);
        }
    }

    render() {
        const { conveyerFull, scannerOn, plcInformation, plcPort, plcTime } = this.state;

        return (
            <div className='info'>
                <p className='bool_light header' onClick={this.getPLCInfo()}>Conveyer Updates:</p>
                <p className='bool_light bold'>Conveyer Full: <p className="bool_light light"> {conveyerFull}</p></p>
                <p className='bool_light bold'>Scanner On: <p className="bool_light light"> {scannerOn}</p></p>
                <p className='bool_light bold'>PLC Info.: <p className="bool_light light"> {plcInformation}</p></p>
                <p className='bool_light bold'>Port: <p className="bool_light light"> {plcPort}</p></p>
                <p className='bool_light bold'>PLC Time: <p className="bool_light light"> {plcTime}</p></p>
                <p className='bool_light bold'>Last Scanned Barcode: <Barcode/></p>
            </div>
        );
    }
};

export default Info;