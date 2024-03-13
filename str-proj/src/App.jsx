import { useEffect, useState } from 'react'
import './App.css'
import Button from './components/Button';
import Barcode from './components/Barcode';
import Roller from './components/Roller'
import 'bootstrap/dist/css/bootstrap.css'
import TestButton from './components/TestButton';
import TestScriptButton from './components/TestScriptButton';
import ButtonList from './components/ButtonList'




function App() {


  const [imageSrc, setImageSrc] = useState('src/data_chart.png')
  const [GETNum, setGETNum] = useState(null);
  const [POSTNum, setPOSTNum] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      updateMonitor();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateMonitor = async () => {
    console.log('Updating chart...')
    const randNum = Math.floor(Math.random() * 100);
    await getRequestStats();
    setImageSrc(`src/data_chart.png?${randNum}`);
  }



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
  


  // Handles presentation of GET and POST requests
  const [dataRequestList, setDataRequestList] = useState([
    { id : 'numRequests', caption : 'Number of Requests:', value : 'GP' },
    { id : 'numGetRequests', caption : 'Get Request Count:', value : 'G'},
    { id : 'numPostRequests', caption : 'Post Request Count:', value : 'P' }
  ]);

  return (
    <div className='realApp'>
      <div className='panel white_bg'>
        <p className='other_title' id="btnPnl">Conveyer Automation Interface</p>
      </div>

      <div className='app'>
        <div className='mainComponents'>
          <div className='stacklights white_bg'>
            <p className='title header'>Stack Lights</p>

            {/* Rendering the button list*/}
            {/* {buttonList.map((button) => (
              <Button id={button.id} w={button.w} h ={button.h} c={colorForClick(button.color)} text={button.text} onClick={() => lightClickedHandler(button.color)} /> 
            ))} */}
            <ButtonList/>
          
          </div>
          <div className='roller text-align white_bg'>
            <Roller/>
          </div>

          <div className='dashboard white_bg'>
            <p className='other_title'>Data Transmission Monitor</p>
            <p className='bullet'><b className='get'>- GET Request</b></p>
            <p className='bullet'><b className='post'>- POST Request</b></p>
            <img className='dataImg' src={imageSrc}></img>


            {dataRequestList.map((dataRequest) => {
              let reqCount = 0;
              if (dataRequest.value === 'G') {
                reqCount = GETNum;
              } else if (dataRequest.value === 'P') {
                reqCount = POSTNum;
              } else {
                reqCount = GETNum + POSTNum;
              }
              return (
                <p className='other_title caption' key={dataRequest.id}>{dataRequest.caption} <span className='msg'>{reqCount}</span></p>
              );
            })}
          </div>
        </div>

        <div className='bottomComponents white_bg'>
          <p className='center_text other_title'>Button Panel</p>

          <div className="row">
            <div className='col'>
              <TestScriptButton/>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default App;
