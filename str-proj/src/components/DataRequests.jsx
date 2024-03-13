import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import '../App.css'

const DataRequests = () => {

    // Represents the graph being updated
    const [imageSrc, setImageSrc] = useState('../src/data_chart.png')
    // Number of GET requests
    const [GETNum, setGETNum] = useState(null);
    // Number of POST requestd
    const [POSTNum, setPOSTNum] = useState(null);
  
    // Sets an interval for 5000ms and updates the monitor
    useEffect(() => {
      const interval = setInterval(() => {
        updateMonitor();
      }, 5000);
  
      return () => clearInterval(interval);
    }, []);
  
    // Sets the image to a different image each time.
    const updateMonitor = async () => {
      console.log('Updating chart...')
      const randNum = Math.floor(Math.random() * 100);
      await getRequestStats();
      setImageSrc(`../src/data_chart.png?${randNum}`);
    }
  

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
    <div>
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
  );
};

export default DataRequests;