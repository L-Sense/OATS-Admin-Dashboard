import axios from "axios";
import { config } from '../config'
import { authenticationService } from "./authenticationService";

axios.defaults.baseURL = config.SERVICE_URL

export const employeeService = {
    getAllEmployees,
    getOneEmployee,
    createNewEmployee,
    updateEmployee,
    updateImages,
};

async function getAllEmployees(){
    return await axios
        .get("/employee")
        .then(res =>{
            return res
        })
}

async function getOneEmployee(employeeId){
    var url = "/employee/".concat(employeeId)
    return await axios
        .get(url)
        .then(res =>{
            return res
        })
}

async function createNewEmployee(newEmployeeData){
    return await axios
        .post("/employee", {
            'employee_name': newEmployeeData['employee_name'],
            'department': newEmployeeData['department'],
            'image_1': newEmployeeData['image_1'],
            'image_2': newEmployeeData['image_2'],
            'image_3': newEmployeeData['image_3'],
        }, {
            headers: {
                Authorization: authenticationService.getToken(),
            }
        })
        .then(res =>{
            return res
        })
}

async function updateEmployee(employeeID, newEmployeeData){
    var url = "/employee/update/".concat(employeeID)
    return await axios
        .put(url, {
            'employee_name': newEmployeeData['employee_name'],
            'department': newEmployeeData['department'],
        }, {
            headers: {
                Authorization: authenticationService.getToken(),
            }
        })
        .then(res =>{
            return res
        })
}


async function updateImages(){
    var url = "/image"
    return await axios
        .get(url)
        .then(res =>{
            return res
    })
}