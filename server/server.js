//Require express
const express = require('express');
//Require a logging middleware that is useful for debugging purposes: morgan
const morgan = require('morgan');
//Require dayjs
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
//Require express-validator which is used to perform validation
const { body, validationResult, param } = require('express-validator');
//Require passport
const passport = require('passport');
//Require LocalStrategy for authentication with username and password
const LocalStrategy = require('passport-local').Strategy;
//Require session
const session = require('express-session');

//Define the port number for the server
const PORT = 3001;
//Require the dao module for accessing tasks in DB
const taskDao = require('./task-dao');
//Require the dao module for accessing users in DB
const userDao = require('./user-dao');

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
    function (username, password, done) {
        userDao.getUser(username, password).then((user) => {
            if (!user)
                return done(null, false, { message: 'Incorrect username and/or password.' });

            return done(null, user);
        })
    }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
            done(err, null);
        });
});

app = new express();
app.use(morgan('dev'));
app.use(express.json());

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    return res.status(401).json({ error: 'not authenticated' });
}

// set up the session
app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    //a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie
    secret: '0Ws0TQxSueD0eFNepQgrsE1j5RMU68xB89wOkgANHGAS4RwomWhYiX031QmrOqqT5B8GJ8nPmVHusvDuxVyWp1zZmTL$EdWqP2e4htDjDZabw0YOrAaam6w0pt7LkZcL',
    resave: false,
    saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/*** Tasks APIs ***/

//GET: Retrieve all tasks from db
app.get('/api/tasks', isLoggedIn, (req, res) => {
    taskDao.retrieveAll(req.user.id)
        .then(tasks => res.status(200).json(tasks))
        .catch(err => res.status(500).json(err));
});

//GET: Retrieve all important tasks from db.
//It's necessary to put this method before the get at /api/tasks/:id, if we put it after that get then conflicts will arise.
app.get('/api/tasks/filter=important', isLoggedIn, (req, res) => {
    taskDao.retrieveImportant(req.user.id)
        .then(tasks => res.status(200).json(tasks))
        .catch(err => res.status(500).json(err));
});

//GET: Retrieve all private tasks from db.
//It's necessary to put this method before the get at /api/tasks/:id, if we put it after that get then conflicts will arise.
app.get('/api/tasks/filter=private', isLoggedIn, (req, res) => {
    taskDao.retrievePrivate(req.user.id)
        .then(tasks => res.status(200).json(tasks))
        .catch(err => res.status(500).json(err));
});

//GET: Retrieve all tasks from db whose deadline is today.
//It's necessary to put this method before the get at /api/tasks/:id, if we put it after that get then conflicts will arise.
app.get('/api/tasks/filter=today', isLoggedIn, (req, res) => {
    taskDao.retrieveToday(req.user.id)
        .then(tasks => res.status(200).json(tasks))
        .catch(err => res.status(500).json(err));
});

//GET: Retrieve all tasks from db whose deadline is in the next 7 days.
//It's necessary to put this method before the get at /api/tasks/:id, if we put it after that get then conflicts will arise.
app.get('/api/tasks/filter=next7days', isLoggedIn, (req, res) => {
    taskDao.retrieveNext7Days(req.user.id)
        .then(tasks => res.status(200).json(tasks))
        .catch(err => res.status(500).json(err));
});

//GET: Retrieve a task from db given its id.
app.get('/api/tasks/:id', isLoggedIn, async (req, res) => {
    //Id must be an integer
    await param('id').isInt().withMessage("Must be an integer value").run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //If there are errors then return status 404 and the object with the array of errors
        return res.status(404).json({ errors: errors.array() });
    }
    taskDao.retrieveById(req.params.id, req.user.id)
        .then(task => res.status(200).json(task))
        .catch(err => {
            if (err.errors)
                res.status(404).json(err);
            else
                res.status(500).json(err);
        });
});

//POST: Save a new task into the db.
app.post('/api/tasks', isLoggedIn, async (req, res) => {
    //Perform validation. withMessage is used to print custom error messages. bail is used to block the chain of validation when it has already failed.
    await Promise.all([
        //Description must be a string of at least 5 chars
        body('description').isString().withMessage("Must be a string").bail().isLength({ min: 5 }).withMessage("Must be at least 5 chars long").run(req),
        //Important must be a boolean
        body('important').isBoolean().withMessage("Must be a boolean (true/false)").run(req),
        //Private must be a boolean
        body('priv').isBoolean().withMessage("Must be a boolean (true/false)").run(req),
        //Here I do a custom validation to check that the deadline is either not specified (=null) or a string in the correct format
        body('deadline').custom(() => {
            if (req.body.deadline === null)
                return true;
            else if (typeof req.body.deadline === 'string' && dayjs(req.body.deadline, 'YYYY-MM-DD[T]HH:mm').isValid())
                return true;
            else
                return false;
        }).withMessage("Must be either null or a deadline represented as a string in the format YYYY-MM-DD[T]HH:mm").run(req),
        //Completed must be a boolean
        body('completed').isBoolean().withMessage("Must be a boolean (true/false)").run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //If there are errors then return status 422 and the object with the array of errors
        return res.status(422).json({ errors: errors.array() });
    }
    taskDao.insertTask(req.body, req.user.id)
        .then(taskId => res.status(201)
            .set({ "Location": `http://localhost:${PORT}/api/tasks/${taskId}` })
            .json({ "id of the new task": taskId, "outcome": "success, see Location header for the location of the new resource" }))
        .catch(err => res.status(500).json(err));
});

//PUT: Update an existing task into the db. It includes the mark operation.
app.put('/api/tasks/:id', isLoggedIn, async (req, res) => {
    //Perform validation. withMessage is used to print custom error messages. bail is used to block the chain of validation when it has already failed.
    await Promise.all([
        //Id must be an integer
        param('id').isInt().withMessage("Must be an integer value").run(req),
        //Description must be a string of at least 5 chars
        body('description').isString().withMessage("Must be a string").bail().isLength({ min: 5 }).withMessage("Must be at least 5 chars long").run(req),
        //Important must be a boolean
        body('important').isBoolean().withMessage("Must be a boolean (true/false)").run(req),
        //Private must be a boolean
        body('priv').isBoolean().withMessage("Must be a boolean (true/false)").run(req),
        //Here I do a custom validation to check that the deadline is either not specified (=null) or a string in the correct format
        body('deadline').custom(() => {
            if (req.body.deadline === null)
                return true;
            else if (typeof req.body.deadline === 'string' && dayjs(req.body.deadline, 'YYYY-MM-DD[T]HH:mm').isValid())
                return true;
            else
                return false;
        }).withMessage("Must be either null or a deadline represented as a string in the format YYYY-MM-DD[T]HH:mm").run(req),
        //Completed must be a boolean
        body('completed').isBoolean().withMessage("Must be a boolean (true/false)").run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //If there are errors then return status 422 and the object with the array of errors
        return res.status(422).json({ errors: errors.array() });
    }
    taskDao.updateTask(req.body, req.params.id, req.user.id)
        .then(() => res.status(200).json({ "id of the updated task": req.params.id, "outcome": "success" }))
        .catch(err => {
            if (err.errors)
                res.status(404).json(err);
            else
                res.status(500).json(err);
        });
});

//DELETE: Delete an existing task from the db.
app.delete('/api/tasks/:id', isLoggedIn, async (req, res) => {
    //Id must be an integer
    await param('id').isInt().withMessage("Must be an integer value").run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //If there are errors then return status 404 and the object with the array of errors
        return res.status(404).json({ errors: errors.array() });
    }
    taskDao.deleteByID(req.params.id, req.user.id)
        .then(() => res.status(200).json({ "id of the deleted task": req.params.id, "outcome": "success" }))
        .catch(err => {
            if (err.errors)
                res.status(404).json(err);
            else
                res.status(500).json(err);
        });
});

/*** Users APIs ***/

// POST /api/sessions 
// login
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            // this is coming from userDao.getUser()
            return res.json(req.user);
        });
    })(req, res, next);
});

// DELETE /api/sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
    req.logout();
    res.end();
});

// GET /api/sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    }
    else
        res.status(401).json({ error: 'Unauthenticated user!' });;
});