import React, { useState, useEffect } from 'react'
import rollerImage from '../assets/roller.png'
import Tote from './Tote'
import Info from './Info'
import './Roller.css'
import 'bootstrap/dist/css/bootstrap.css'


const Roller = () => {
    const [zoneStatus, setZoneStatus] = useState([]);

    useEffect(() => {
        const connectToPLC = async () => {
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

                console.log('Zones Used')
                console.log(zoneStatusList);

                setZoneStatus(zoneStatusList);
            } catch (error) {
                console.log({error});
            }

        };
        connectToPLC();
    }, []);


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
    )
}

export default Roller;