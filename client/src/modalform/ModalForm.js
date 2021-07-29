//import react-bootstrap components
import { Button, Modal, Form, Col } from 'react-bootstrap';
//imports needed to use state
import React, { useState } from 'react';
//import dayjs
import dayjs from 'dayjs';
import API from '../API';


//Callback that will receive a new task, will add it to the local copy of the tasklist, will call the proper API
//function to send it to the server
const addTask = (newTask, setDirty, setTaskList) => {
    setTaskList((oldList) => oldList.concat(newTask));
    API.addNewTask(newTask).then(() => setDirty ? setDirty(true) : null);
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

function TaskForm(props) {
    //TaskForm custom component for the form

    //Define the message to show according to the operation that we need to perform
    const message = props.addOperation ? `Here you can create a new Task! You can set its description, you can decide whether it is important or not,
    you can set it as private or public and, if you want, you can also set a deadline for it.` : `Here you can edit the chosen Task! You can change its
    description, importance, privacy and deadline.`;

    //Flag used to set isInvalid on description Form.Control so that special style is applied
    let invalidDescriptionFlag = ((props.validated === true && props.emptyDesc === true) || (props.validated === true && props.emptyDesc === false && props.longDesc === false));

    //Form.Control.Feedback error messages for description. They're shown only when conditions are met
    let emptyDescriptionErrorMessage = (props.validated === true && props.emptyDesc === true) ?
        (<Form.Control.Feedback type="invalid">Please provide a description for the Task.</Form.Control.Feedback>) : "";
    let shortDescriptionErrorMessage = (props.validated === true && props.emptyDesc === false && props.longDesc === false) ?
        (<Form.Control.Feedback type="invalid">The description must be at least 5 characters long.</Form.Control.Feedback>) : "";

    //Flag used to set isInvalid on date Form.Control so that special style is applied
    let invalidDateFlag = ((props.validated === true && props.emptyDate !== props.emptyTime && props.emptyDate === true));

    //Form.Control.Feedback error messages for date. They're shown only when conditions are met
    let dateRequiredErrorMessage = (props.validated === true && props.emptyDate !== props.emptyTime && props.emptyDate === true) ?
        (<Form.Control.Feedback type="invalid">Since time has been set, a date is required too.</Form.Control.Feedback>) : "";

    //Flag used to set isInvalid on time Form.Control so that special style is applied
    let invalidTimeFlag = ((props.validated === true && props.emptyDate !== props.emptyTime && props.emptyTime === true));

    //Form.Control.Feedback error messages for time. They're shown only when conditions are met
    let timeRequiredErrorMessage = (props.validated === true && props.emptyDate !== props.emptyTime && props.emptyTime === true) ?
        (<Form.Control.Feedback type="invalid">Since a date has been set, the time is required too.</Form.Control.Feedback>) : "";

    return (<Form>
        <Form.Text>
            {message}
        </Form.Text>
        <br />
        <Form.Row>
            <Form.Group as={Col} xs="12" controlId="descriptionForm">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" placeholder="Write here..." value={props.taskDesc}
                    onChange={(event) => props.setTaskDesc(event.target.value)} isInvalid={invalidDescriptionFlag} />
                {emptyDescriptionErrorMessage}
                {shortDescriptionErrorMessage}
            </Form.Group>
        </Form.Row>
        <Form.Row>
            <Form.Group as={Col} xs="6" controlId="importanceForm">
                <Form.Label>Set importance</Form.Label>
                <Form.Control as="select" value={props.taskImp} onChange={(event) => props.setTaskImp(event.target.value)}>
                    <option>Not important</option>
                    <option >Important</option>
                </Form.Control>
            </Form.Group>
            <Form.Group as={Col} xs="6" controlId="privacyForm">
                <Form.Label>Set privacy</Form.Label>
                <Form.Control as="select" value={props.taskPriv} onChange={(event) => props.setTaskPriv(event.target.value)}>
                    <option >Private</option>
                    <option>Public</option>
                </Form.Control>
            </Form.Group>
        </Form.Row>
        <Form.Row>
            <Form.Group as={Col} xs="6" controlId="dateForm">
                <Form.Label>Set deadline</Form.Label>
                <Form.Control type="date" value={props.taskDeadline} onChange={(event) => props.setTaskDeadline(event.target.value)}
                    isInvalid={invalidDateFlag} />
                {dateRequiredErrorMessage}
            </Form.Group>
            <Form.Group as={Col} xs="6" controlId="timeForm">
                <Form.Label>Set time</Form.Label>
                <Form.Control type="time" value={props.taskTime} onChange={(event) => props.setTaskTime(event.target.value)}
                    isInvalid={invalidTimeFlag} />
                {timeRequiredErrorMessage}
            </Form.Group>
        </Form.Row>
    </Form>)
}

function ModalForm(props) {

    //addOperation is true if the operation is add, false if the operation is edit (when the description is not empty)
    const addOperation = (props.modalTask.description === "");

    //Define the title for the modal according to which operation we need to perform
    const title = addOperation ? "New task" : "Edit task";

    //States for the fields of the form 
    const [taskDesc, setTaskDesc] = useState(props.modalTask.description);
    const [taskImp, setTaskImp] = useState(props.modalTask.important);
    const [taskPriv, setTaskPriv] = useState(props.modalTask.priv);
    const [taskDeadline, setTaskDeadline] = useState(props.modalTask.date);
    const [taskTime, setTaskTime] = useState(props.modalTask.time);

    //States used for validation:
    //emptyDesc : true if the description is empty, false otherwise
    const [emptyDesc, setEmptyDesc] = useState(true);
    //longDesc : true if the description is long enough (5 chars), false otherwise
    const [longDesc, setLongDesc] = useState(false);
    //emptyDate : true if the date field is empty, false otherwise
    const [emptyDate, setEmptyDate] = useState(true);
    //emptyTime : true if the time field is empty, false otherwise
    const [emptyTime, setEmptyTime] = useState(true);
    //validated : becomes true after the first submit so that error messages are shown
    const [validated, setValidated] = useState(false);

    const addOrEditTaskThenCloseModal = () => {
        if (addOperation) {
            //Add operation
            //Create the new temporary task with the temporary id
            let newTask = new props.constr(`task${props.temptid}`, taskDesc, taskImp === "Important", taskPriv === "Private", (taskDeadline !== "" && taskTime !== "") ? dayjs(taskDeadline + "T" + taskTime) : undefined, false, true);
            //Increment temporary id
            props.setTempTid((id) => id + 1);
            //Call the function to add the temporary task to the local copy of the tasklist and to send its info to the server
            addTask(newTask, props.setDirty, props.setTaskList);
        }
        else {
            //Edit operation
            const editedTask = new props.constr(props.modalTask.id, taskDesc, taskImp === "Important", taskPriv === "Private", (taskDeadline !== "" && taskTime !== "") ? dayjs(taskDeadline + "T" + taskTime) : undefined, props.modalTask.completed, true);
            editTask(editedTask, props.setDirty, props.setTaskL);
        }
        //Set the modal state in App to false so that the modal is destroyed
        props.setModal(false);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        //Check if the form is valid, if so add/edit the task and close the modal
        //First case: description long enough, both date and time set, deadline is set
        if (taskDesc.length >= 5 && taskDeadline !== "" && taskTime !== "") {
            addOrEditTaskThenCloseModal();
        }
        //Second case: description long enough, both date and time not set
        else if (taskDesc.length >= 5 && taskDeadline === "" && taskTime === "") {
            addOrEditTaskThenCloseModal();
        }
        else {
            //Form is not valid, but perform validation and update states accordingly so that messages are shown on the form
            //Validation for description:
            if (taskDesc.length === 0) {
                setEmptyDesc(true);
                setLongDesc(false);
            }
            else if (taskDesc.length < 5 && taskDesc.length > 0) {
                setEmptyDesc(false);
                setLongDesc(false);
            }
            else {
                setEmptyDesc(false);
                setLongDesc(true);
            }
            //Validation for deadline:
            if (taskDeadline !== "" && taskTime === "") {
                setEmptyDate(false);
                setEmptyTime(true);
            }
            else if (taskDeadline === "" && taskTime !== "") {
                setEmptyDate(true);
                setEmptyTime(false);
            }
            else if (taskDeadline !== "" && taskTime !== "") {
                setEmptyDate(false);
                setEmptyTime(false);
            }
            else {
                setEmptyDate(true);
                setEmptyTime(true);
            }
            //From the first time that the user clicks on the Save button the validated state is set to true
            setValidated(true);
        }
    };

    return (
        <>
            <Modal show={true} onHide={() => props.setModal(false)} backdrop="static" keyboard={false} centered animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TaskForm taskDesc={taskDesc} setTaskDesc={setTaskDesc} taskImp={taskImp} setTaskImp={setTaskImp}
                        taskPriv={taskPriv} setTaskPriv={setTaskPriv} taskDeadline={taskDeadline} setTaskDeadline={setTaskDeadline}
                        taskTime={taskTime} setTaskTime={setTaskTime} validated={validated} emptyDesc={emptyDesc} longDesc={longDesc}
                        emptyDate={emptyDate} emptyTime={emptyTime} addOperation={addOperation} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => props.setModal(false)}>
                        Close
                    </Button>
                    <Button variant="success" onClick={handleSubmit}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalForm;