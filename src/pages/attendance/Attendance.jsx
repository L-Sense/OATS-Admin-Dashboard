import React from 'react'
import { DataGrid } from '@material-ui/data-grid';
import { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import DatePicker from 'react-datepicker';
import moment from 'moment'
import { Redirect } from'react-router-dom';
import { authenticationService } from '../../services/authenticationService';
import { attendanceService } from '../../services/attendanceService';


import './attendance.css';
import "react-datepicker/dist/react-datepicker.css";

const useStyles = makeStyles({
    root: {
      '& .Normal': {
        backgroundColor: 'lightgreen',
        color: 'black',
      },
      '& .Abnormal': {
        backgroundColor: 'orange',
        color: 'black',
      },
      '& .Leave': {
        backgroundColor: 'darkgray',
        color: 'black',
      },
    },
  });

export default function Attendance() {
    const classes = useStyles();
    
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    
    async function getInitialData(){
        setLoading(true)
        const res = await attendanceService.getTodayAttendance()
        setLoading(false)
        var tempData = res.data.data
        tempData.map((person)=>{
            person['id'] = person.employee_id
        })
        setRows(tempData)
    }
    useEffect(()=>{
        getInitialData()
        console.log(rows)
    }, []);
    

    let validStatusFlags = new Set(["Normal", "Abnormal", "Leave"])
    
    async function handleStartDateChange(date){
        setLoading(true)
        setStartDate(date)
        const res = await attendanceService.getSpecificDateAttendance(moment(date).format('DD/MM/YYYY'))
        setLoading(false)
        var tempData = res.data.data
        tempData.map((person)=>{
            person['id'] = person.employee_id
        })
        setRows(tempData)
        setStartDate(date)
    }
    
    const [startDate, setStartDate] = useState(new Date());
    
    async function handleCellValueChange(value){
        const rowIndex = rows.findIndex(row => row.id === value.id);

        if (rowIndex >= 0) {
            const row = rows[rowIndex];
            const newRows = [...rows];

            var originalValue = row[value.field]
            if (value.field in row && originalValue !== value.value) {
                if(validStatusFlags.has(value.value)){
                    newRows[rowIndex][value.field] = value.value;
                }
                else{
                    newRows[rowIndex][value.field] = originalValue;
                }
                console.log(moment(startDate).format('DD/MM/YYYY'))
                console.log(row.id)
                console.log(value.value)

                const res = await attendanceService.updateSpecificDateAttendance(moment(startDate).format('DD/MM/YYYY'), row.id, value.value)
                if(res.data.message==="invalid input"){
                    newRows[rowIndex][value.field] = originalValue;
                    alert("An issue has occurred when submitting the record.")
                }
                console.log(res.data.message)
                
                setRows(newRows);
            }
        }
    }

    const columns = [
        {
            field: 'id',
            headerName: 'Employee ID',
            width: 160
        },
        {
            field: 'employee_name',
            headerName: 'Employee',
            width: 200,
        },
        {
            field: 'department_name',
            headerName: 'Department',
            width: 200,
        },
        {
            field: 'in_time',
            headerName: 'Check In Time',
            width: 180,
        },
        {
            field: 'out_time',
            headerName: 'Check Out Time',
            width: 180,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 170,
            editable: true,
        },
    ];
    
    
    const isLoggedIn = authenticationService.getToken()
    if(isLoggedIn==null){
        return (
            <Redirect to="/login"/>
        )
    }
    return (
        <div id ='attendance' className={classes.root}>
            <DatePicker
                className='datePicker'
                selected={startDate}
                onChange={
                    (date) => {
                        handleStartDateChange(date)
                    }
                }
                disabled={loading}
                />
            { loading ? 
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <CircularProgress sx={{ marginX: 'auto' }}/>
                </div> : 
                <DataGrid className=''
                    rowHeight={50}
                    rows={rows}
                    columns={columns}
                    pageSize={8}
                    rowsPerPageOptions={[8]}
                    checkboxSelection={false}
                    disableSelectionOnClick
                    getCellClassName={(params) => {
                        if (params.field != 'status_flag') {
                        return '';
                        }
                        return params.value;
                    }}
                    onCellEditCommit={handleCellValueChange}
                />
            }
        </div>
    )
}
