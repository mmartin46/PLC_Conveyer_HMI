
import React from 'react'
import toteImage from '../assets/tote.png'
import './Roller.css'


const Tote = ({visible}) => {

    return <div>
        {visible ? 
        (
            <img className="toteImage" src={toteImage}/>
        ) : (
            <p></p>
        )}
        </div>
}

export default Tote;