import React, { useState, useEffect } from 'react'
import rollerImage from '../assets/roller.png'
import Tote from './Tote'
import Info from './Info'
import './Roller.css'
import 'bootstrap/dist/css/bootstrap.css'


class Roller extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            zoneStatus : []
        };
    }

    componentDidMount() {
        // Updates every second.
        this.intervalId = setInterval(this.connectToPLC, 1000);
    }

    componentWillUnmount() {
        // Cleans up
        return () => clearInterval(this.intervalId);
    }

    connectToPLC = async () => {
        try {
            const response = await fetch('http://192.168.0.254:8081/zone-check');
            if (!response.ok) {
                throw new Error('Failed to fetch zones');
            }

            const data = await response.json();

            const zoneStatusList = [];
                
            let i;

            console.log(data);
            for (i = 1; i <= 5; i++) {
                const zoneName = `Zone ${i}`;
                let zoneValue = data[zoneName]['value'];
                zoneStatusList.push(zoneValue);
            }

            this.setState({ zoneStatus : zoneStatusList }, () => {
                console.log('Zones updated');
            });
        } catch (error) {
            console.log({error});
        }
    }
    
    render() {
        const { zoneStatus } = this.state;

        return (
            <div className='wholeRoller'>
                <p className='title header' onClick={zoneStatus}>Conveyer</p>
    
                <div className="zones title">
                    {zoneStatus.map((whichState, index) => (
                        <div key={index}>
                            <p>{`Zone ${index + 1}`}</p>
                            <Tote visible={whichState}/>
                        </div>
            
            ))}
                </div>
    
                <img className="image text-center" src={rollerImage} alt="Roller" />
                <Info/>
            </div>
        );
    }

}

export default Roller;