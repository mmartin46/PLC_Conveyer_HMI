import { useEffect, useState } from 'react'
import './App.css'
import Button from './components/Button';
import Barcode from './components/Barcode';
import Roller from './components/Roller'
import 'bootstrap/dist/css/bootstrap.css'
import TestButton from './components/TestButton';
import TestScriptButton from './components/TestScriptButton';
import ButtonList from './components/ButtonList'
import DataRequests from './components/DataRequests';



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


            <DataRequests/>
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
