import React from 'react'
import { DataGrid } from '@material-ui/data-grid';
import { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { dummy_attendance } from '../../data/dummy_attendance';
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
      /*
      '& .MC': {
        backgroundColor: 'darkgray',
        color: 'black',
      },
      
      // Doesn't work with 2 word flag
      '& .AWOL': {
        ba1ckgroundColor: 'red',
        color: 'white',
      },
      */
    },
  });

export default function Attendance() {
    const classes = useStyles();
    //Have a date picker. Upon selection, data will be updated with data on that date only.
    //Initiall call API to get today's records
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    //Consider put a spinner while loading
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
    //Note, it is required that the params object contains a unique id for each entry, even though we are not using that id.
    //onRowEditStop can be put into DataGrid tags<> maybe to update database => if do this then should be able to do editing
    
    //Update this to set to new date data
    async function handleStartDateChange(date){
        //API call to get data from new date
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
        // NEED TO CHANGE THIS FOR API
        const rowIndex = rows.findIndex(row => row.id === value.id);

        if (rowIndex >= 0) {
            const row = rows[rowIndex];
            const newRows = [...rows];

            // Validate if changed
            var originalValue = row[value.field]
            if (value.field in row && originalValue !== value.value) {
                if(validStatusFlags.has(value.value)){
                    newRows[rowIndex][value.field] = value.value;
                }
                else{
                    newRows[rowIndex][value.field] = originalValue;
                }
                console.log("hi")
                console.log(moment(startDate).format('DD/MM/YYYY'))
                console.log(row.id)
                console.log(value.value)

                const res = await attendanceService.updateSpecificDateAttendance(moment(startDate).format('DD/MM/YYYY'), row.id, value.value)
                if(res.data.message==="invalid input"){
                    // API returned a fail
                    newRows[rowIndex][value.field] = originalValue;
                    alert("An issue has occurred when submitting the record.")
                }
                console.log(res.data.message)
                
                setRows(newRows);
                // Sending to API
                /*
                Api.product.update(data).then(res => {
                    const newRows = [...rows];
        
                    if (res.success) {
                    // Change to new value
                    newRows[rowIndex][value.field] = value.value;
                    } else {
                    // Change to old value
                    newRows[rowIndex][value.field] = row[value.field];
                    }
                */
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
            //Change to markdown
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
