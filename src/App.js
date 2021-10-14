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

function App() {
  return (
    <Router>
      <div className='container'>
        <Switch>
          <Route exact path='/'>
            <Sidebar/>
            <Home/>
          </Route>
          <Route exact path='/login'>
            <Login/>
          </Route>
          <Route path='/employees'>
            <Sidebar/>
            <EmployeeList/>
          </Route>
          <Route path='/employee/:id'>
            <Sidebar/>
            <Employee/>
          </Route>
          <Route path='/attendance'>
            <Sidebar/>
            <Attendance/>
          </Route>
          <Route path='/newEmployee'>
            <Sidebar/>
            <NewEmployee/>
          </Route>
          <Route path='/*'>
            <Sidebar/>
            <InvalidURL/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
