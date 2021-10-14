import Sidebar from "./components/Sidebar/Sidebar";
import "./App.css";
import EmployeeList from "./pages/employeeList/EmployeeList"
import Employee from "./pages/employee/Employee"
import NewEmployee from  "./pages/newEmployee/NewEmployee"
import Attendance from "./pages/attendance/Attendance"
import Home from "./pages/home/Home"
import Login from "./pages/login/Login"
import InvalidURL from "./pages/invalidURL/InvalidURL";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {DefaultLayout, LoginLayout} from './layouts/index';

function App() {
  return (
    <Router>
      <div className='container'>
        <Switch>
          <Route exact path='/'>
            <DefaultLayout/>
            <Sidebar/>
            <Home/>
          </Route>
          <Route exact path='/login'>
            <LoginLayout>
            <Login/>
            </LoginLayout>
          </Route>
          <Route path='/employees'>
            <DefaultLayout/>
            <Sidebar/>
            <EmployeeList/>
          </Route>
          <Route path='/employee/:id'>
            <DefaultLayout/>
            <Sidebar/>
            <Employee/>
          </Route>
          <Route path='/attendance'>
            <DefaultLayout/>
            <Sidebar/>
            <Attendance/>
          </Route>
          <Route path='/newEmployee'>
            <DefaultLayout/>
            <Sidebar/>
            <NewEmployee/>
          </Route>
          <Route path='/*'>
            <DefaultLayout/>
            <Sidebar/>
            <InvalidURL/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
