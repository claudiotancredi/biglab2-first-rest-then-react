const dayjs = require("dayjs");

const url = 'http://localhost:3000';

/**
 * Constructor for an exception object
 * @param {string} msg String with the error message of the HTTP request
 */
function ResponseException(msg) {
    this.msg = msg;
}

/**
 * Function that performs an async GET request to retrieve all the tasks using the proxy call to reach the API server
 * @returns Promise to be consumed with the list of tasks
 */
async function loadAllTasks() {
    const response = await fetch(url + '/api/tasks');
    if (!response.ok) {
        throw new ResponseException(response.status + " " + response.statusText);
    }

    const tasks = await response.json();
    return tasks.map(t => {
        t = ({ ...t, important: (Boolean(t.important)), priv: (Boolean(t.private)), deadline: t.deadline !== null ? dayjs(t.deadline) : undefined, completed: (Boolean(t.completed)) });
        delete t.user;
        delete t.private;
        return t;
    });

}

/**
 * Function that performs an async GET request to retrieve all the important tasks using the proxy call to reach the API server
 * @returns Promise to be consumed with the list of tasks
 */
async function loadImportantTasks() {
    const response = await fetch(url + '/api/tasks/filter=important');
    if (!response.ok) {
        throw new ResponseException(response.status + " " + response.statusText);
    }

    const tasks = await response.json();
    return tasks.map(t => {
        t = ({ ...t, important: (Boolean(t.important)), priv: (Boolean(t.private)), deadline: t.deadline !== null ? dayjs(t.deadline) : undefined, completed: (Boolean(t.completed)) });
        delete t.user;
        delete t.private;
        return t;
    });
}

/**
 * Function that performs an async GET request to retrieve all the private tasks using the proxy call to reach the API server
 * @returns Promise to be consumed with the list of tasks
 */
async function loadPrivateTasks() {
    const response = await fetch(url + '/api/tasks/filter=private');
    if (!response.ok) {
        throw new ResponseException(response.status + " " + response.statusText);
    }

    const tasks = await response.json();
    return tasks.map(t => {
        t = ({ ...t, important: (Boolean(t.important)), priv: (Boolean(t.private)), deadline: t.deadline !== null ? dayjs(t.deadline) : undefined, completed: (Boolean(t.completed)) });
        delete t.user;
        delete t.private;
        return t;
    });
}

/**
 * Function that performs an async GET request to retrieve all the tasks whose deadline is todayusing the proxy call to reach the API server
 * @returns Promise to be consumed with the list of tasks
 */
async function loadTodayTasks() {
    const response = await fetch(url + '/api/tasks/filter=today');
    if (!response.ok) {
        throw new ResponseException(response.status + " " + response.statusText);
    }

    const tasks = await response.json();
    return tasks.map(t => {
        t = ({ ...t, important: (Boolean(t.important)), priv: (Boolean(t.private)), deadline: t.deadline !== null ? dayjs(t.deadline) : undefined, completed: (Boolean(t.completed)) });
        delete t.user;
        delete t.private;
        return t;
    });
}

/**
 * Function that performs an async GET request to retrieve all the tasks whose deadline is in the next 7 days using the proxy call to reach the API server
 * @returns Promise to be consumed with the list of tasks
 */
async function loadNext7DaysTasks() {
    const response = await fetch(url + '/api/tasks/filter=next7days');
    if (!response.ok) {
        throw new ResponseException(response.status + " " + response.statusText);
    }

    const tasks = await response.json();
    return tasks.map(t => {
        t = ({ ...t, important: (Boolean(t.important)), priv: (Boolean(t.private)), deadline: t.deadline !== null ? dayjs(t.deadline) : undefined, completed: (Boolean(t.completed)) });
        delete t.user;
        delete t.private;
        return t;
    });
}

/**
 * Function that will perform a POST request to the server to store a new task.
 * @param {object} newTask A task object with the info of the task to send to the server
 */
async function addNewTask(newTask) {
    await fetch(url + '/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            description: newTask.description,
            important: newTask.important,
            priv: newTask.priv,
            deadline: newTask.deadline === undefined ? null : newTask.deadline.format('YYYY-MM-DD[T]HH:mm'),
            completed: newTask.completed
        })
    });
}

/**
 * Function that performs a PUT request to the server to update an existing task with given id.
 * @param {object} editedTask A task object with the info of the task to be updated on the server.
 */
async function updateTask(editedTask) {
    await fetch(url + '/api/tasks/' + editedTask.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            description: editedTask.description,
            important: editedTask.important,
            priv: editedTask.priv,
            deadline: editedTask.deadline === undefined ? null : editedTask.deadline.format('YYYY-MM-DD[T]HH:mm'),
            completed: editedTask.completed
        })
    });
}

/**
 * Function that performs a DELETE request to the server to delete an existing task with given id.
 * @param {number} idTask Id of the task to delete on the server.
 */
async function deleteTask(idTask) {
    await fetch(url + '/api/tasks/' + idTask, {
        method: 'DELETE'
    });
}

/**
 * Function that performs the login through a POST request to the server
 * @param {object} credentials object with username and password of the user that wants to log in 
 * @returns an object with the user name and the user id
 */
async function logIn(credentials) {
    let response = await fetch(url + '/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return { name: user.name, id: user.id };
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

/**
 * Function that performs the logout through a DELETE request to the server
 */
async function logOut() {
    await fetch(url + '/api/sessions/current', { method: 'DELETE' });
}

/**
 * Function that checks wheather a user is logged in or not through a GET request to the server
 * @returns an object with the user info (id, username, name)
 */
async function getUserInfo() {
    const response = await fetch(url + '/api/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}



const API = { loadAllTasks, addNewTask, loadImportantTasks, loadNext7DaysTasks, loadPrivateTasks, loadTodayTasks, updateTask, deleteTask, logIn, logOut, getUserInfo }

export default API;