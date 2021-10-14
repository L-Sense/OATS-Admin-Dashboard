import React from 'react'
import {useState, useEffect} from 'react'
import './employee.css'
import PersonIcon from '@material-ui/icons/Person';
import { Redirect } from 'react-router-dom';
import { authenticationService } from '../../services/authenticationService';
import { employeeService } from '../../services/employeeService'

export default function Employee() {

    const [employeeData, setEmployeeData] = useState([])

    const [employeeID, setEmployeeID] = useState('')

    const [newEmployeeName, setNewEmployeeName] = useState('')
    const handleNewEmployeeNameChange = event=>{
        setNewEmployeeName(event.target.value)
    }

    const [newEmployeeDepartmentID, setNewEmployeeDepartmentID] = useState('')
    const handleNewEmployeeDepartmentIDChange = event=>{
        setNewEmployeeDepartmentID(event.target.value)
    }

    async function getOneData(employeeID){
        const res = await employeeService.getOneEmployee(employeeID)
        var tempData = res.data.data
        setEmployeeData(tempData)
    }

    useEffect(()=>{
        var currentURL = window.location.href
        var employeeID = currentURL.split('/').slice(-1)
        setEmployeeID(employeeID)
        getOneData(employeeID)
    }, [])

    async function handleSubmit(event){
        event.preventDefault()
        var validationResult = employeeNameValidation(newEmployeeName)
        if(validationResult.length!==0){
            alert("Invalid character in employee name: " + validationResult)
            return
        }
        var requestData = {
            'employee_name': newEmployeeName,
            'department': newEmployeeDepartmentID,
        }

        let response = await employeeService.updateEmployee(employeeID, requestData)
        console.log(response.data)
        if(response.data.message!="employee data updated"){
            //Error occurred, handle
            alert("An error has occured, please try again.")
            return
        } else{
            //New employee created just fine
            alert("Updated employee: "  + "Name: " + newEmployeeName + "newEmployeeDepartmentID: " + newEmployeeDepartmentID)
            window.location.href='/employees'
        }

        console.log(requestData)
        alert("Remember to do the API")
        window.location.href='/employees'
    }

    const employeeNameValidation = (name)=>{
        // For each char in name, check if it's alpha
        var letters = /^[A-Za-z\s]+$/;
        for (let i = 0; i < name.length; i++) {
            if(!name[i].match(letters)){
                return name[i]
            }
        }
        return ''
    }

    const isLoggedIn = authenticationService.getToken()
    if(isLoggedIn==null){
        return (
            <Redirect to="/login"/>
        )
    }
    return (
        <div className='employee'>
            <div className="employeeTitleContainer">
                <h1 className='employeeTitle'>Edit Employee Data</h1>
            </div>
            <div className="employeeContainer">
                <div className="employeeShow">
                    <div className="employeeShowTop">
                        
                        <div className="employeeShowTopTitle">
                            <span className="employeeShowName"><b>{employeeData.employee_name}</b></span>
                            <span className="employeeShowDepartment">Department: <b>{employeeData.department_name}</b></span>
                        </div>
                    </div>
                    <div className="employeeShowBottom">
                        <span className="employeeShowTitle">Employee details</span>
                        <div className="employeeShowInfo">
                            <PersonIcon className= "employeeShowIcon"/>
                            <span className="employeeShowInfoTitle">Employee ID: {employeeData.employee_id}</span>
                        </div>
                    </div>
                </div>
                <div className="employeeUpdate">
                    <span className="employeeUpdateTitle">Edit</span>
                    <form onSubmit={handleSubmit} action="" className="employeeUpdateForm">
                        <div className="employeeUpdateLeft">
                            <div className="employeeUpdateItem">
                                <label>Employee's Name</label>
                                <input type='text' placeholder="Employee's full name"
                                value={newEmployeeName}
                                onChange={handleNewEmployeeNameChange}
                                className="employeeUpdateInput"/>
                            </div>
                            <div className="employeeUpdateItem">
                                <label>Employee's Department ID</label>
                                <input type='text' placeholder="Employee's department" 
                                value={newEmployeeDepartmentID}
                                onChange={handleNewEmployeeDepartmentIDChange}
                                className="employeeUpdateInput"/>
                            </div>
                            
                        </div>
                        <div className="employeeUpdateRight">
                            <button type="submit" className="employeeUpdateButton">Update</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}