import { useState, useEffect, Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import '../App.css'

class DataRequests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imageSrc : '../public/data_chart.png', // Represents the graph being updated
            GETNum : 0, // Number of GET requests
            POSTNum : 0, // Number of POST requests
            dataRequestList : [   // Handles presentation of GET and POST requests
                { id : 'numRequests', caption : 'Number of Requests:', value : 'GP' },
                { id : 'numGetRequests', caption : 'Get Request Count:', value : 'G'},
                { id : 'numPostRequests', caption : 'Post Request Count:', value : 'P' }
            ]
        };

        this.updateMonitor = this.updateMonitor.bind(this);
    }
  
    // Sets an interval for 5000ms and updates the monitor
    componentDidMount() {
        this.interval = setInterval(() => {
        this.updateMonitor();
      }, 5000);
    }

    // Clears the interval right before unmounting
    componentWillUnmount() {
        clearInterval(this.interval);
    }
  
    // Sets the image to a different image each time.
    updateMonitor = async () => {
      console.log('Updating chart...')
      const randNum = Math.floor(Math.random() * 100);
      await this.getRequestStats();
      this.setState({ imageSrc : `../public/data_chart.png?${randNum}` });
    }
  

    getRequestStats = async () => {
        try {
        const response = await fetch('http://localhost:5000/get-request-stats');

        if (!response.ok) {
            throw new Error('Failed to fetch http data');
        }
        const data = await response.json();


        this.setState({ GETNum : data['GET'] });
        this.setState({ POSTNum : data['POST']});
        } catch (error) {
        console.error('Failed to connect', error);
        }
    }  

    render() {
            const { imageSrc, GETNum, POSTNum, dataRequestList } = this.state;
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
        }
};

export default DataRequests;