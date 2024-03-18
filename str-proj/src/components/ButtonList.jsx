import Button from './Button'
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import '../App.css'

const ButtonList = () => {
    // Colors that specify when the
    // button has been toggled on or off.
    const colors = {
        'RED' : ['#6B1318', '#9D0E16'],
        'YELLOW' : ['#CCAB04', '#E5C007'],
        'GREEN' : ['#288801', '#32AE01'],
        'BLUE' : ['#01446D', '#0067A8']
    };
    
    const [lights, setLights] = useState({
        'RED': false,
        'YELLOW': false,
        'GREEN': false,
        'BLUE': false
    });

  // If the light was toggled on
  // Try to connect to the PLC
  const handleLightOn = async(color, value) => {
    try {
      await connectToPLC(color, value);
    } catch (error) {
      console.error('Failed to connect to PLC', error);
    }
  }
  
  // Reads the current light value and
  // sets the button based off of the value read.
  const readLightValue = async (color) => {
    try {
      const response = await fetch('http://192.168.0.254:8081/read-light-status', {
        method: 'POST',
        headers : {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'color' : color.toLowerCase(),
        })
      });

      if (!response.ok) {
        throw new Error('Connected failed');
      }

      const data = await response.json();

      // Update lights based on value read.
      setLights(prevLights => ({
        ...prevLights,
        [color]: data.value === 1
      }));
    } catch (error) {
      console.error('Failed to connect', error);
    }
  };

  useEffect(() => {
    Object.keys(lights).forEach(color => {
      readLightValue(color);
    });
  }, []);


  // Connects to the PLC and turns lights on
  // and off based on their value.
  const connectToPLC = async (color, value) => {
    try {
      const response = await fetch('http://192.168.0.254:8081/connect-to-plc', {
        method: 'POST',
        headers : {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                              'color' : color.toLowerCase(),
                              'value' : value
                              })
      });

      if (!response.ok) {
        throw new Error('Connection failed');
      }

      const data = await response.json();
    } catch (error) {
      console.error('Failed to connect', error);
    }
  };


  const lightClickedHandler = async (color) => {
    setLights(prevLights => {
      // Gets the previous light clicked
      // and constrasts it with the new light.
      const newLights = {
        ...prevLights,
        [color]: !prevLights[color]
      };

      if (newLights[color] !== prevLights[color]) {
        if (newLights[color]) {
          // Light Toggled On
          handleLightOn(color, 1);
        } else {
          // Light Toggled Off
          handleLightOn(color, 0);
        }
      }

      return newLights;
    });

  };
  
  // If a light was pressed change to a different light
  const colorForClick = (color) => lights[color] ? colors[color][1] : colors[color][0];

  // List of buttons
  const [buttonList, setButtonList] = useState([
    { id : 'redLight', w : 150, h : 60, color : 'RED', text : 'RED' },
    { id : 'yellowLight', w : 150, h : 60, color : 'YELLOW', text : 'YELLOW' },
    { id : 'greenLight', w : 150, h : 60, color : 'GREEN', text : 'GREEN' },
    { id : 'blueLight', w : 150, h : 60, color : 'BLUE', text : 'BLUE' },
  ]);

  return (
    <div>
        {buttonList.map((button) => (
            <Button id={button.id} w={button.w} h ={button.h} c={colorForClick(button.color)} text={button.text} onClick={() => lightClickedHandler(button.color)} /> 
        ))}
    </div>
  );
};

export default ButtonList;