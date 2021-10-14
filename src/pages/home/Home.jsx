import React from 'react';
import { Redirect } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { authenticationService } from '../../services/authenticationService';
import { attendanceService } from '../../services/attendanceService';

import './home.css'


export default function Home() {
    const [date, setDate] = useState(new Date())
    const tick = () =>{
        setDate(new Date());
    }
    useEffect(() =>{
        var timerID = setInterval( () => tick(), 1000 );
        return function cleanup() {
            clearInterval(timerID);
        };
    })

    const [checkedOutData, setCheckedOutData] = useState([])
    const [checkedInData, setCheckedInData] = useState([])

    async function getInitialData(){
        const res = await attendanceService.getTodayCheckInOutCount()
        console.log(res)
        var tempCheckOut = [
            ['Employee Status', 'Number'],
            ['Not Checked Out', res.data.data.total_employees - res.data.data.checked_out_today_count],
            ['Checked Out', res.data.data.checked_out_today_count],
        ]
        var tempCheckIn = [
            ['Employee Status', 'Number'],
            ['Not Checked In', res.data.data.total_employees - res.data.data.checked_in_today_count],
            ['Checked In', res.data.data.checked_in_today_count],
        ]
        setCheckedOutData(tempCheckOut)
        setCheckedInData(tempCheckIn)
    }

    useEffect(()=>{
        getInitialData()
    }, [])
    
    const isLoggedIn = authenticationService.getToken()
    if(isLoggedIn==null){
        return (
            <Redirect to="/login"/>
        )
    }

    // Issues with the number here - Maybe just delete this whole page?
    

    return (
        <div className="home">
            <div className="clockContainer">
                <div className="clock">
                    <h3 className="clockDisplay">{date.toLocaleTimeString()}</h3>
                </div>
            </div>
            <br></br>
            <div className="chartsContainer">
                <div className="pieChartsContainer">
                    <Chart
                        width={'600px'}
                        height={'300px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={checkedInData}
                        options={{
                          title: 'Check In Information',
                          pieSliceText: 'value'
                        }}
                        rootProps={{ 'data-testid': '1' }}
                    />
                </div>
                <div className="pieChartsContainer">
                    <Chart
                        width={'600px'}
                        height={'300px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={checkedOutData}
                        options={{
                          title: 'Check Out Information',
                          pieSliceText: 'value'
                        }}
                        rootProps={{ 'data-testid': '1' }}
                    />
                </div>
            </div>
        </div>
    )
}
