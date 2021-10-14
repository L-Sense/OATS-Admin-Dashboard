import axios from "axios";
import { config } from '../config'

axios.defaults.baseURL = config.SERVICE_URL

export const authenticationService = {
    login,
    logout,
    authorize,
    getToken,
};

async function login(username, password, history) {
    return await axios
        .post("auth/login", {
            'username': username,
            'password': password,
        })
        .then((res) => {
            localStorage.setItem("token", res.data.data.Authorization);
            history.push('/');
            return true
        })
        .catch((err) => {
            localStorage.setItem("token", '');
            return false
        });
}

function logout() {
    localStorage.removeItem('token');
    return Promise.resolve();
}

async function authorize(){
    let token = getToken()
    if (config.DEBUG) {
        if (token == null) {
            return Promise.reject()
        }
        // console.log("token ", token);
        return Promise.resolve()
    }
    if (token === null) return Promise.reject()

    return await axios
        .get("auth/check", {
            headers: {
                Authorization: getToken()
            }
        });
}

function getToken(){
    var temp = localStorage.getItem('token')
    return (temp==="undefined" ? null : temp)
}