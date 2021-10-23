import React from 'react'
import { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { authenticationService } from '../../services/authenticationService';
import { employeeService } from '../../services/employeeService';

import './newEmployee.css'

export default function NewEmployee() {

    const [newEmployeeName, setNewEmployeeName] = useState('')
    const handleNewEmployeeNameChange = event=>{
        setNewEmployeeName(event.target.value)
    }


    const [newEmployeeDepartmentID, setNewEmployeeDepartmentID] = useState('')
    const handleNewEmployeeDepartmentIDChange = event=>{
        setNewEmployeeDepartmentID(event.target.value)
    }

    const [employeeImages, setNewEmployeeImages] = useState([])
    const handleEmployeeImagesChange = event=>{
        setNewEmployeeImages(event.target.files)
    }

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            resolve(fileReader.result.replace("data:", "").replace(/^.+,/, ""));
          }
          fileReader.onerror = (error) => {
            reject(error);
          }
        })
    }

    async function handleSubmitNewEmployee(event){
        event.preventDefault()

        var validationResult = employeeNameValidation(newEmployeeName)
        if(validationResult.length!==0){
            alert("Invalid character in employee name: " + validationResult)
            return
        }
        if(newEmployeeDepartmentID.length===0 || newEmployeeName.length===0){
            alert("A field has been left empty.")
            return
        }
        if(employeeImages.length===0){
            alert("No images were selected. Kindly submit at least 1.")
            return
        }

        var requestData = {
            'employee_name': newEmployeeName,
            'department': newEmployeeDepartmentID,
            'image_1': employeeImages.length>0 ? await convertBase64(employeeImages[0]):"null",
            'image_2': employeeImages.length>1 ? await convertBase64(employeeImages[1]):"null",
            'image_3': employeeImages.length>2 ? await convertBase64(employeeImages[2]):"null"
        }
        console.log(requestData)
        let response = await employeeService.createNewEmployee(requestData)
        console.log(response.data)
        await employeeService.updateImages()
        if(response.data.message!="new employee created"){
            alert("An error has occured, please try again.")
            return
        } else{
            alert("Submitted new employee: "  + "Name: " + newEmployeeName + "newEmployeeDepartmentID: " + newEmployeeDepartmentID)
        }   
    }

    const employeeNameValidation = (name)=>{
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
        <div className="newEmployee">
            <div className="newTitleContainer">
                <h1 className='newTitle'>Create a new employee</h1>
            </div>
            <div className="newEmployeeFormContainer">
                <div className="newInnerFormContainer">
                    <span className="newEmployeeTitle">New Employee</span>
                    <form onSubmit={handleSubmitNewEmployee} className="newEmployeeForm">
                        <div className="newEmployeeLeft">
                            <div className="newEmployeeItem">
                                <label>Employee Name</label>
                                <input type='text' placeholder="Employee Name" value={newEmployeeName} onChange={handleNewEmployeeNameChange} className="newEmployeeInput"/>
                            </div>
                            <div className="newEmployeeItem">
                                <label>Department ID</label>
                                <input type='text' placeholder="Department ID" value={newEmployeeDepartmentID} onChange={handleNewEmployeeDepartmentIDChange} className="newEmployeeInput"/>
                            </div>
                            <div className="newEmployeeItem">
                                <label>Upload Images</label>
                                <input type="file" multiple onChange={handleEmployeeImagesChange} className="newEmployeeInput"/>
                            </div>
                        </div>
                        <div className="newEmployeeRight">
                            <button type="submit" className="employeeUpdateButton">Create New Employee</button>
                        </div>
                    </form>
                </div>
                <div className="blankSpace">
                </div>
            </div>
        </div>
        
    )
}
