import { useEffect, useState } from 'react'
import './App.css'
import Button from './components/Button';
import Barcode from './components/Barcode';
import Roller from './components/Roller'
import 'bootstrap/dist/css/bootstrap.css'

// Colors that specify when the
// button has been toggled on or off.
const colors = {
  'RED' : ['#6B1318', '#9D0E16'],
  'YELLOW' : ['#CCAB04', '#E5C007'],
  'GREEN' : ['#288801', '#32AE01'],
  'BLUE' : ['#01446D', '#0067A8']
};



function App() {
  const [lights, setLights] = useState({
    'RED': false,
    'YELLOW': false,
    'GREEN': false,
    'BLUE': false
  });

  const [imageSrc, setImageSrc] = useState('src/data_chart.png')
  const [GETNum, setGETNum] = useState(null);
  const [POSTNum, setPOSTNum] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      updateMonitor();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateMonitor = () => {
    console.log('Updating chart...')
    const randNum = Math.floor(Math.random() * 100);
    setImageSrc(`src/data_chart.png?${randNum}`);
  }


  // If the light was toggled on
  // Try to connect to the PLC
  const handleLightOn = async(color, value) => {
    try {
      await connectToPLC(color, value);
    } catch (error) {
      console.error('Failed to connect to PLC', error);
    }
  }

  // Connects to the PLC and turns lights on
  // and off based on their value.
  const connectToPLC = async (color, value) => {
    try {
      const response = await fetch('http://localhost:5000/connect-to-plc', {
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


  useEffect(() => {
    const interval = setInterval(() => {
      updateMonitor();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  

  const getRequestStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/get-request-stats');

      if (!response.ok) {
        throw new Error('Failed to fetch http data');
      }
      const data = await response.json();

      console.log('hey')

      setGETNum(data['GET']);
      setPOSTNum(data['POST']);
    } catch (error) {
      console.error('Failed to connect', error);
    }
  }
  

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

    await getRequestStats();
  };
  
  // If a light was pressed change to a different light
  const colorForClick = (color) => {
    return lights[color] ? colors[color][1] : colors[color][0];
  }

  return (
    <div className='realApp'>
      <div className='panel white_bg'>
        <p className='other_title' id="btnPnl">Conveyer Automation Interface</p>
      </div>

      <div className='app'>
        <div className='mainComponents'>
          <div className='stacklights white_bg'>
            <p className='title header'>Stack Lights</p>
          
            <Button id="redLight" w={150} h={60} c={colorForClick('RED')} text='RED' onClick={() => lightClickedHandler('RED')}/>
            <Button id="yellowLight" w={150} h={60} c={colorForClick('YELLOW')} text='YELLOW' onClick={() => lightClickedHandler('YELLOW')} />
            <Button id="greenLight" w={150} h={60} c={colorForClick('GREEN')} text='GREEN' onClick={() => lightClickedHandler('GREEN')} />
            <Button id="blueLight" w={150} h={60} c={colorForClick('BLUE')} text='BLUE' onClick={() => lightClickedHandler('BLUE')}/>
          </div>
          <div className='roller text-align white_bg'>
            <Roller/>
          </div>

          <div className='dashboard white_bg'>
            <p className='other_title'>Data Transmission Monitor</p>
            <p className='bullet'><b className='get'>- GET Request</b></p>
            <p className='bullet'><b className='post'>- POST Request</b></p>
            <img className='dataImg' src={imageSrc}></img>
            <p className='other_title caption'>Number Of Requests:</p>
            <p className='other_title caption'>Get Requests: <span className='msg'>{GETNum}</span></p>
            <p className='other_title caption'>Post Requests: <span className='msg'>{POSTNum}</span></p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
