'use strict';
/* Data Access Object (DAO) module for accessing tasks */

//Require dayjs
const dayjs = require('dayjs');

const db = require('./db');

/**
 * Query the db to get all the tasks
 * @param {number} user id of the user who's doing the request. It's used to get only the tasks of the logged in user
 * @returns a promise that will resolve to the list of tasks retrieved from the db
 */
exports.retrieveAll = (user) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM tasks WHERE user=?";
        db.all(sql, [user], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}

/**
 * Query the db to get a task with the given id. 
 * @param {string} id of the task to retrieve
 * @param {number} user id of the user who's doing the request. It's used to get the task only if the required task belongs to him
 * @returns a promise that will resolve to the task with the given id
 */
exports.retrieveById = (id, user) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM tasks WHERE id=? AND user=?";
        db.get(sql, [id, user], (err, row) => {
            if (err)
                //If there are errors then reject err
                reject(err);
            else if (row === undefined)
                //If there is not a task with the given id, then return an object with the info about the error
                reject({
                    errors: [{
                        value: id, msg: "The specified id does not point to any resource on the server. Please be sure to use the id of an existing task",
                        param: "id", location: "params"
                    }]
                })
            else
                resolve(row);
        });
    });
}

/**
 * Query the db to get all important tasks
 * @param {number} user id of the user who's doing the request. It's used to get only the tasks of the logged in user
 * @returns a promise that will resolve to the list of important tasks
 */
exports.retrieveImportant = (user) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM tasks WHERE important=1 AND user=?";
        db.all(sql, [user], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}

/**
 * Query the db to get all private tasks
 * @param {number} user id of the user who's doing the request. It's used to get only the tasks of the logged in user
 * @returns a promise that will resolve to the list of private tasks
 */
exports.retrievePrivate = (user) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM tasks WHERE private=1 AND user=?";
        db.all(sql, [user], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}

/**
 * Query the db to get all tasks whose deadline is today
 * @param {number} user id of the user who's doing the request. It's used to get only the tasks of the logged in user
 * @returns a promise that will resolve to the list of tasks whose deadline is today
 */
exports.retrieveToday = (user) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM tasks WHERE deadline < DATETIME(?) AND deadline > DATETIME(?) AND user=?";
        db.all(sql, [dayjs().add(1, 'day').hour(0).minute(0).format('YYYY-MM-DD[T]HH:mm'), dayjs().hour(0).minute(0).format('YYYY-MM-DD[T]HH:mm'), user], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}

/**
 * Query the db to get all tasks whose deadline is in the next 7 days
 * @param {number} user id of the user who's doing the request. It's used to get only the tasks of the logged in user
 * @returns a promise that will resolve to the list of tasks whose deadline is in the next 7 days
 */
exports.retrieveNext7Days = (user) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM tasks WHERE deadline < DATETIME(?) AND deadline > DATETIME(?) AND user=?";
        db.all(sql, [dayjs().add(8, 'day').hour(0).minute(0).format('YYYY-MM-DD[T]HH:mm'), dayjs().add(1, 'day').hour(0).minute(0).format('YYYY-MM-DD[T]HH:mm'), user], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}

/**
 * Query the db to insert a new task. Id will be automatically chosen by sqlite
 * @param {object} task to insert in the db
 * @param {number} user id of the user who's doing the request
 * @returns a promise that will resolve to the id of the new inserted task
 */
exports.insertTask = (task, user) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO tasks (description, important, private, deadline, completed, user) VALUES(?, ?, ?, ?, ?, ?)';
        db.run(sql, [task.description, task.important, task.priv, task.deadline, task.completed, user], function (err) {
            if (err)
                reject(err);
            else
                resolve(this.lastID);
        });
    });
};

/**
 * Query the db to update a task given its id
 * @param {object} task object with the new info to insert into the db
 * @param {string} id of the task to update
 * @param {number} user id of the user who's doing the request. The update is done only if the task belongs to the logged user
 * @returns a promise that will resolve
 */
exports.updateTask = (task, id, user) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE tasks SET description=?, important=?, private=?, deadline=?, completed=? WHERE id = ? AND user = ?';
        db.run(sql, [task.description, task.important, task.priv, task.deadline, task.completed, id, user], function (err) {
            if (err)
                reject(err);
            else if (this.changes === 0)
                reject({
                    errors: [{
                        value: id, msg: "The specified id does not point to any resource on the server. Please be sure to use the id of an existing task",
                        param: "id", location: "params"
                    }]
                })
            else
                resolve();
        });
    });
};

/**
 * Query the db to delete a task given its id
 * @param {string} id of the task to delete
 * @param {number} user id of the user who's doing the request. The update is done only if the task belongs to the logged user
 * @returns a promise that will resolve
 */
exports.deleteByID = (id, user) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM tasks WHERE id = ? AND user = ?';
        db.run(sql, [id, user], function (err) {
            if (err)
                reject(err);
            else if (this.changes === 0)
                reject({
                    errors: [{
                        value: id, msg: "The specified id does not point to any resource on the server. Please be sure to use the id of an existing task",
                        param: "id", location: "params"
                    }]
                })
            else
                resolve();
        });
    });
}