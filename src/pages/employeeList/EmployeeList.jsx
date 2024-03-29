import React from 'react'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'
import './employeeList.css'
import { DataGrid } from '@material-ui/data-grid';
import { CircularProgress } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { authenticationService } from '../../services/authenticationService';
import { employeeService } from '../../services/employeeService';

export default function EmployeeList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    async function getAllData(){
        setLoading(true)
        const res = await employeeService.getAllEmployees()
        setLoading(false)
        var tempData = res.data.data
        tempData.map((person)=>{
            person['id'] = person.employee_id
        })
        setData(tempData)
    }
    useEffect(()=>{
        getAllData()
    }, [])
    
    const columns = [
        {
            field: 'id',
            headerName: 'Employee ID',
            width: 200
        },
        {
            field: 'employee_name',
            headerName: 'Employee',
            width: 340,
        },
        {
            field: 'department_id',
            headerName: 'Department ID',
            width: 200,
        },
        {
            field: 'department_name',
            headerName: 'Department',
            width: 200,
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params)=>{
                return(
                    <>
                        <Link to={"/employee/" + params.row.id}>
                            <button className="employeeListEdit">Edit</button>
                        </Link>
                    </>
                )
            }
        },
    ];

    const isLoggedIn = authenticationService.getToken()
    if(isLoggedIn==null){
        return (
            <Redirect to="/login"/>
        )
    }

    return (
        <div className='employeeList'>
            {loading ? 
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <CircularProgress sx={{ marginX: 'auto' }}/>
                </div> :
                <DataGrid
                    rowHeight={100}
                    rows={data}
                    columns={columns}
                    pageSize={6}
                    checkboxSelection={false}
                    disableSelectionOnClick
                />
            }
        </div>
    )
}
