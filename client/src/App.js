//import my CSS
import './mycss/custom.css';
//import bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
//import react-bootstrap components
import { Container, Row} from 'react-bootstrap';
//imports needed to use state
import React, { useState, useEffect } from 'react';
//import my components
import NavBar from './navbar/Navbar';
import Sidebar from './sidebar/Sidebar';
import MainContent from './maincontent/MainContent';
import LoginForm from './login/Login';
//import react-router-dom components
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch, Redirect } from 'react-router-dom';
//import APIs
import API from './API';

/**
 * Constructor for a Task object.
 * @param {*} id required
 * @param {string} description required
 * @param {boolean} important Optional field, default: false
 * @param {boolean} priv Optional field, default: true
 * @param {dayjs} deadline Optional field, default: undefined
 * @param {boolean} completed Optional field, default: false
 * @param {boolean} temp Optional field, default: false. Used to mark a task as temporary so that it will be treated in a different way.
 */
function Task(id, description, important = false, priv = true, deadline = undefined, completed = false, temp = false) {
  this.id = id;
  this.description = description;
  this.important = important;
  this.priv = priv;
  this.deadline = deadline;
  this.completed = completed;
  this.temp = temp;
}

function App() {
  //Define a boolean state for the sidebar to allow responsive behavior (RB)
  //See Sidebar.js for further explanations
  const [sidebarRB, setSidebarRB] = useState(false);

  // Define a list state to contain the tasks. At mount phase the list will be empty, until a request on the backend is performed
  const [taskList, setTaskList] = useState([]);

  //Define a state for a message to show ("welcome user"/"incorrect username and/or password")
  const [message, setMessage] = useState('');
  //Define a state to manage login. undefined -> request not satisfied yet, false -> user not logged in, true -> user logged in
  const [loggedIn, setLoggedIn] = useState(undefined);
  //Define a state to manage user information (its name, which will be displayed on the navbar)
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      API.getUserInfo().then((user) => { setLoggedIn(true); setUserName(user.name); }).catch((err) => { console.error(err.error); setLoggedIn(false) });
    }
    checkAuth();
  }, []);

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUserName(user.name);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setTaskList([]);
    setUserName('');
    setMessage('');
  }

  return (
    <Router>
      <Container fluid>

        <Switch>
          <Route exact path="/login" render={() =>
            <>{loggedIn === true ? <Redirect to="/" /> : <></>}
              {loggedIn === false ? <LoginForm login={doLogIn} message={message} setMessage={setMessage}/> : <></>}
          </>} />
        </Switch>
        {loggedIn === true ? (<>      <NavBar setSidebarRBState={setSidebarRB} username={userName} logout={doLogOut} />
          <Row className="vheight-100">

            <Sidebar sidebarRB={sidebarRB} />

            <MainContent tasks={taskList} setTaskL={setTaskList} constr={Task} loggedIn={loggedIn} message={message} setMessage={setMessage} />

          </Row> </>) : <></> }
        {loggedIn === false? <Redirect to='/login'/> : <></>}

      </Container>
    </Router>
  );
}

export default App;
