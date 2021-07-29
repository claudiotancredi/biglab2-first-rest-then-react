//import my icons
import publicTaskIcon from "../myicons/publicTaskIcon.svg";
import editIcon from "../myicons/editIcon.svg";
import deleteIcon from "../myicons/deleteIcon.svg";
import pathErrorIcon from "../myicons/pathErrorIcon.svg";
//import react-bootstrap components
import { ListGroup, Image, Form, Figure, Button, Spinner, Alert, Row } from 'react-bootstrap';
//import dayjs
import dayjs from 'dayjs';
//import dayjs plugins
import calendarplugin from 'dayjs/plugin/calendar';
import isBetweenplugin from 'dayjs/plugin/isBetween';
//import react-router-dom components
import { Route, Switch, Redirect } from 'react-router-dom';
//import my components
import ModalForm from '../modalform/ModalForm';
//imports needed to use state
import React, { useEffect, useState } from 'react';
//import APIs
import API from '../API';

//Extend dayjs to use calendarplugin and isBetweenplugin
dayjs.extend(calendarplugin);
dayjs.extend(isBetweenplugin);

function FilterTitle(props) {
    //FilterTitle custom component
    return (
        <>
            <h1 className="noNewLine">Filter: </h1>
            <h1 className="filterText noNewLine">{props.filterName}</h1>
        </>
    )
}

// Callback that receives an updated task, updates it locally and performs an API call to send it to the server
const editTask = (editedTask, setDirty, setTaskList) => {
    setTaskList((oldList) => {
        //Starting from the oldList check each task, if it matches the one that we're editing then
        //create a new object that will replace it and return it
        const list = oldList.map((task) => {
            if (task.id === editedTask.id) {
                return editedTask;
            }
            else {
                return task;
            }
        });
        return list;
    });
    API.updateTask(editedTask).then(() => setDirty ? setDirty(true) : null);
}

//Callback that receives an old task, update its temp property and performs an API call to delete it from the server
const deleteTask = (editedTask, setDirty, setTaskList) => {
    setTaskList((oldList) => {
        //Starting from the oldList check each task, if it matches the one that we're editing then
        //create a new object that will replace it and return it
        const list = oldList.map((task) => {
            if (task.id === editedTask.id) {
                return editedTask;
            }
            else {
                return task;
            }
        });
        return list;
    });
    API.deleteTask(editedTask.id).then(() => setDirty ? setDirty(true) : null);
}

function CheckboxAndTaskDescription(props) {
    //CheckboxAndTaskDescription custom component

    //If the task is important then add the class important, else add "" => it won't be marked in red
    let important = props.task.important ? "important" : "";

    return (
        <Form>
            <Form.Check id={props.task.id} className={important} as="input" type="checkbox" label={props.task.description} onClick={props.task.temp ? null : () => {
                let editedTask = new props.constr(props.task.id, props.task.description, props.task.important, props.task.priv, props.task.deadline, !props.task.completed, true);
                editTask(editedTask, props.setDirty, props.setTaskL);
            }} custom defaultChecked={props.task.completed} disabled={props.task.temp} />
        </Form>
    )
}

function TaskInfo(props) {
    //TaskInfo custom component to show the info of a task (checkbox, description, icon for public tasks, deadline, 
    //but edit and delete buttons are not included, they are in TaskControl)
    //I used calendar plugin to better format dates
    let date = props.task.deadline !== undefined ? props.task.deadline.calendar(null, {
        sameDay: '[Today at] HH:mm', // The same day ( Today at 02:30 )
        nextDay: '[Tomorrow at] HH:mm', // The next day ( Tomorrow at 02:30 )
        lastDay: '[Yesterday at] HH:mm', // The day before ( Yesterday at 02:30 )
        nextWeek: 'dddd [at] HH:mm', // The next week ( Sunday at 02:30 )
        lastWeek: '[Last] dddd [at] HH:mm', // Last week ( Last Monday at 02:30 )
        sameElse: 'dddd D MMMM YYYY [ at ] HH:mm' // Everything else ( Monday 21 March 2021 at 02:30 )
    }) : <div />;
    return (
        <>
            <CheckboxAndTaskDescription task={props.task} constr={props.constr} setTaskL={props.setTaskL} setDirty={props.setDirty} />
            {props.task.priv === false ? (<Image src={publicTaskIcon} />) : (<div />)}
            <small>{date}</small>
        </>
    )
}

function TaskControl(props) {
    //TaskControl custom component - edit and delete buttons
    return (
        <div>
            <Button size="sm" variant="link outline-light" as="img" src={editIcon} onClick={props.task.temp ? null : () => {
                //Update the modalTask state with a task that will be passed to the modal form
                props.setModalTask({
                    id: props.task.id,
                    description: props.task.description,
                    important: props.task.important ? "Important" : "Not important",
                    priv: props.task.priv ? "Private" : "Public",
                    date: props.task.deadline !== undefined ? props.task.deadline.format("YYYY-MM-DD") : "",
                    time: props.task.deadline !== undefined ? props.task.deadline.format("HH:mm") : "",
                    completed: props.task.completed
                });
                //Set modal to true to create and open the modal form
                props.setModal(true);
            }} />
            <Button size="sm" variant="link outline-light" as="img" src={deleteIcon} onClick={props.task.temp ? null : () => {
                let editedTask = new props.constr(props.task.id, props.task.description, props.task.important, props.task.priv, props.task.deadline, props.task.completed, true);
                deleteTask(editedTask, props.setDirty, props.setTaskL);
            }} />
            {props.task.temp && (<Spinner animation="border" variant="success" />)}
        </div>
    )
}

function TaskRow(props) {
    //TaskRow custom component (task info + task control buttons)
    return (
        <ListGroup.Item className="d-flex w-100 justify-content-between">
            <TaskInfo task={props.task} constr={props.constr} setTaskL={props.setTaskL} setDirty={props.setDirty} />
            <TaskControl task={props.task} constr={props.constr} setTaskL={props.setTaskL} setModalTask={props.setModalTask} setModal={props.setModal} setDirty={props.setDirty} />
        </ListGroup.Item>
    )
}


function TasksAccordingToFilter(props) {

    //Define a loading state that will be true at mounting time (of the component, so even when the user changes filter) 
    //and that will be set to false as soon as tasks are retrieved from the server.
    //It is used to show a loading spinner.
    const [loading, setLoading] = useState(true);

    //Define a dirty state that will be true whenever an operation (add/edit/delete) is performed and will be set to false
    //as soon as the operation finishes. It is used to fetch the tasks from the server every time an operation finishes
    const [dirty, setDirty] = useState(true);

    //State used to register that an error has occurred during a HTTP request
    const [error, setError] = useState(false);
    //State used to store the error message of the HTTP request
    const [errorText, setErrorText] = useState("");

    //Destructure props object to use as useEffect dependencies
    const setTaskList = props.setTaskL;
    const Task = props.constr;
    const filter = props.filter;

    // Used at App component mount and triggered every time dirty state changes. 
    // If dirty is true it performs a request to GET the tasks' list from the backend and updates the current taskList state.
    // Then set the dirty and the loading states to false. 
    useEffect(() => {
        //Variable used to avoid slow responses errors/fast filter changes caused by the user
        let isMounted = true;
        //Map each filter to the corresponding API function. This is useful to avoid code repetition
        const filterMapping = {
            "All": API.loadAllTasks,
            "Important": API.loadImportantTasks,
            "Today": API.loadTodayTasks,
            "Next 7 Days": API.loadNext7DaysTasks,
            "Private": API.loadPrivateTasks
        }
        if (dirty) {
            //Call the proper API function
            filterMapping[filter]().then(newTaskList => {
                if (isMounted) {
                    newTaskList = newTaskList.map(t => new Task(t.id, t.description, t.important, t.priv, t.deadline, t.completed));
                    setTaskList(newTaskList);
                }
            }).catch((err) => { if (isMounted) { setTaskList([]); setErrorText(err.msg); setError(true); } }).finally(() => {
                if (isMounted) {
                    setLoading(false);
                    setDirty(false);
                }
            });
        }
        //cleanup function
        return () => {
            isMounted = false;
        };
    }, [dirty, setTaskList, Task, filter]);

    return (<>
        <FilterTitle filterName={props.filter} />
        {loading ? (<Spinner animation="border" variant="success" />) : ""}
        {error ? (<Alert key={1} variant="danger">
            {errorText}
        </Alert>) : (
            <ListGroup variant="flush">
                {props.tasks.map((t) => (<TaskRow key={t.id} task={t} constr={props.constr} setTaskL={props.setTaskL} setModalTask={props.setModalTask} setModal={props.setModal} setDirty={setDirty} />))}
            </ListGroup>
        )}
        {props.modal && (<ModalForm modalTask={props.modalTask} constr={props.constr} setTaskL={props.setTaskL}
            setDirty={setDirty} setTaskList={props.setTaskL} setModal={props.setModal} temptid={props.tempTaskId} setTempTid={props.setTempTaskId} />)}
    </>)
}

function MainContent(props) {
    //MainContent custom component (filter title, table with tasks, modal, + button)

    //Define a boolean state for the modal form so that it is re-created when necessary.
    //This is done because the states of the modal form need to be initialized with proper values
    //that are different depending on which operation we're doing (add, edit), but useState
    //is executed only once at the creation of the component, so we need the modal state to force
    //its creation over and over
    const [modal, setModal] = useState(false);

    //Define a state for the task to pass to the modal form so that everything is initialized as necessary,
    //according to the operation to perform (add, edit)
    const [modalTask, setModalTask] = useState(undefined);

    // //Define a state for ids of TEMPORARY tasks. It will be used like a counter to get a new id every time it is necessary
    const [tempTaskId, setTempTaskId] = useState(1);

    return (
        <>
            <main className="col-sm-8 col-12 below-nav">
                {props.message &&
                    <Row className="justify-content-center"><Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert></Row>}
                <Switch>
                    <Route exact path="/Important">
                        {props.loggedIn === true ? <TasksAccordingToFilter tasks={props.tasks} constr={props.constr} setTaskL={props.setTaskL} setModalTask={setModalTask} setModal={setModal} modalTask={modalTask}
                            tempTaskId={tempTaskId} setTempTaskId={setTempTaskId} modal={modal} filter="Important" key="Important" /> : <Redirect to="/login" />}
                    </Route>
                    <Route exact path="/Private">
                        {props.loggedIn === true ? <TasksAccordingToFilter tasks={props.tasks} constr={props.constr} setTaskL={props.setTaskL} setModalTask={setModalTask} setModal={setModal} modalTask={modalTask}
                            tempTaskId={tempTaskId} setTempTaskId={setTempTaskId} modal={modal} filter="Private" key="Private" /> : <Redirect to="/login" />}
                    </Route>
                    <Route exact path="/Today">
                        {props.loggedIn === true ? <TasksAccordingToFilter tasks={props.tasks} constr={props.constr} setTaskL={props.setTaskL} setModalTask={setModalTask} setModal={setModal} modalTask={modalTask}
                            tempTaskId={tempTaskId} setTempTaskId={setTempTaskId} modal={modal} filter="Today" key="Today" /> : <Redirect to="/login" />}
                    </Route>
                    <Route exact path="/Next7Days">
                        {props.loggedIn === true ? <TasksAccordingToFilter tasks={props.tasks} constr={props.constr} setTaskL={props.setTaskL} setModalTask={setModalTask} setModal={setModal} modalTask={modalTask}
                            tempTaskId={tempTaskId} setTempTaskId={setTempTaskId} modal={modal} filter="Next 7 Days" key="Next7Days" /> : <Redirect to="/login" />}
                    </Route>
                    <Route exact path="/All">
                        {props.loggedIn === true ? <TasksAccordingToFilter tasks={props.tasks} constr={props.constr} setTaskL={props.setTaskL} setModalTask={setModalTask} setModal={setModal} modalTask={modalTask}
                            tempTaskId={tempTaskId} setTempTaskId={setTempTaskId} modal={modal} filter="All" key="AllFilter" /> : <Redirect to="/login" />}
                    </Route>
                    <Route exact path="/">
                        {props.loggedIn === true ? <TasksAccordingToFilter tasks={props.tasks} constr={props.constr} setTaskL={props.setTaskL} setModalTask={setModalTask} setModal={setModal} modalTask={modalTask}
                            tempTaskId={tempTaskId} setTempTaskId={setTempTaskId} modal={modal} filter="All" key="All" /> : <Redirect to="/login" />}
                    </Route>
                    <Route>
                        {props.loggedIn === true ? <><FilterTitle filterName="None" />
                            <br />
                            <Figure>
                                <Figure.Image src={pathErrorIcon} className="mx-auto d-block" />
                                <Figure.Caption>
                                    Wrong filter in URL. Please write an existing filter (all, important, today, next7days, private) or select one of them
                                    from the menu.
                        </Figure.Caption>
                            </Figure>
                            {modal && (<ModalForm modalTask={modalTask} constr={props.constr} setTaskList={props.setTaskL} addTask={props.addTask} setModal={setModal} temptid={tempTaskId} setTempTid={setTempTaskId} />)}
                        </> : <Redirect to="/login" />}
                    </Route>
                </Switch>
            </main>
            <Button type="button" variant="success" size="lg" className="fixed-right-bottom" onClick={() => {
                //Add button
                //Update the modalTask state with an empty task that will be passed to the modal form
                setModalTask({
                    description: "",
                    important: "Not important",
                    priv: "Private",
                    date: "",
                    time: ""
                });
                //Set modal to true to create and open the modal form
                setModal(true);
            }}>+</Button>
        </>
    )
}

export default MainContent;