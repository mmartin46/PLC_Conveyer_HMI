import { useEffect, useState } from 'react'
import './App.css'
import Button from './components/Button';
import Barcode from './components/Barcode';
import Roller from './components/Roller'
import 'bootstrap/dist/css/bootstrap.css'
import TestButton from './components/TestButton';
import APIButton from './components/APIButton';
import ButtonList from './components/ButtonList'
import DataRequests from './components/DataRequests';
import DataMonitorTags from './components/DataMonitorTags'


function App() {


  return (
    <div className='realApp'>
      <div className='panel white_bg'>
        <p className='other_title' id="btnPnl">Conveyer Automation Interface</p>
      </div>

      <div className='app'>
        <div className='mainComponents'>
          <div className='stacklights white_bg'>
            <p className='title header'>Stack Lights</p>
            <ButtonList/>
          </div>

          <div className='roller text-align white_bg'>
            <Roller/>
          </div>

          <div className='dashboard white_bg'>
            <p className='other_title'>Data Transmission Monitor</p>
            <DataMonitorTags/>
            <DataRequests/>
          </div>
        </div>

        <div className='bottomComponents white_bg'>
          <p className='center_text other_title'>Button Panel</p>

          <div className="row">
            <div className='col'>
              <APIButton api="http://localhost:5000/display-lights"
                                failMessage="Failed to fetch data"
                                catchMessage="Failed to display lights"/>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default App;
