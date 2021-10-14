import axios from "axios";
import { config } from '../config'
import { authenticationService } from "./authenticationService";

axios.defaults.baseURL = config.SERVICE_URL

export const attendanceService = {
    getTodayCheckInOutCount,
    getTodayAttendance,
    getSpecificDateAttendance,
    updateSpecificDateAttendance
};

async function getTodayCheckInOutCount(){
    return await axios
        .get("/attendance/counttoday", {
            headers: {
                Authorization: authenticationService.getToken()
            }
        })
        .then((res) =>{
            return res;
        })
}

async function getTodayAttendance(){
    return await axios
        .get("/attendance/gettoday", {
            headers: {
                Authorization: authenticationService.getToken()
            }
        })
        .then((res)=>{
            return res;
        })
}

async function getSpecificDateAttendance(selectedDate){
    return await axios(
        {
            method: "get",
            url: "/attendance/getdate",
            params: {
                date: selectedDate
            },
            headers: {
                Authorization: authenticationService.getToken()
            }
        }
    )
}

async function updateSpecificDateAttendance(selectedDate, employeeID, status){
    return await axios
    .post("/attendance/updatestatus", {
        date: selectedDate,
        employee: employeeID,
        status: status,
    }, {
        headers: {
            Authorization: authenticationService.getToken()
        }
    }).then((res)=>{
        return res
    })
}