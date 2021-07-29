# BigLab 2 - Class: 2021 WA1

## Team name: First REST, then REACT

Team members:
* s292441 Toscano Andrea
* s288032 Vaccaro Francesco
* s292435 Versace Alessandro
* s292523 Tancredi Claudio

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/GH-Classroom-BigLab-Instructions.pdf), covering this and the next BigLab.

Once cloned this repository, instead, write your names in the above section.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## List of usernames (e-mails) and plain text passwords of the example users

| Username (e-mail) | Password |
| :------------- |:-------------|
|andreatoscano@polito.it | aranzulla |
|francescovaccaro@polito.it | ciccio |
|alessandroversace@polito.it | medusa |
|claudiotancredi@polito.it | eusebio |

## List of APIs offered by the server

### Perform login

**HTTP Method**: `POST` <br/>
**URL**: `/api/sessions` <br/>
**Description**: Perform login for a user with username (e-mail) and password <br/>
**Sample request**: <br/>
```http
POST http://localhost:3001/api/sessions
Content-Type: application/json

{
  "username": "claudiotancredi@polito.it", 
  "password": "eusebio"
}
```
```http
POST http://localhost:3001/api/sessions
Content-Type: application/json

{
  "username": "claudiotancredi@polito.it", 
  "password": "akkjfingf"
}
```
**Sample response**: <br/>
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 64
ETag: W/"40-RfLBBjlikySea9MswU6E+/y3RXM"
Set-Cookie: connect.sid=s%3ASzzQWLUZN_Oeh-T4RkeHpldOiC8B1d0a.m3Q4GmLVrLxNUS4MnVa4z8v5hecj8bhRPQjkbONCr8I; Path=/; HttpOnly
Date: Fri, 04 Jun 2021 11:02:05 GMT
Connection: close

{
  "id": 1,
  "username": "claudiotancredi@polito.it",
  "name": "Claudio"
}
```
**Error response(s)**: <br/>
```http
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 49
ETag: W/"31-Zoymuc0GB5Y05HVb13yrtWLixv4"
Date: Fri, 04 Jun 2021 10:59:00 GMT
Connection: close

{
  "message": "Incorrect username and/or password."
}
```

### Check if the user is logged in or not

**HTTP Method**: `GET` <br/>
**URL**: `/api/sessions/current` <br/>
**Description**: Check if the user is logged in or not <br/>
**Sample request**: <br/>
```http
GET http://localhost:3001/api/sessions/current 
```
**Sample response**: <br/>
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 64
ETag: W/"40-RfLBBjlikySea9MswU6E+/y3RXM"
Date: Fri, 04 Jun 2021 11:04:57 GMT
Connection: close

{
  "id": 1,
  "username": "claudiotancredi@polito.it",
  "name": "Claudio"
}
```
**Error response(s)**: <br/>
```http
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 33
ETag: W/"21-V8x1OYsvKEIKIAIW760m3YHzhZ0"
Date: Fri, 04 Jun 2021 11:04:33 GMT
Connection: close

{
  "error": "Unauthenticated user!"
}
```

### Perform logout

**HTTP Method**: `DELETE` <br/>
**URL**: `/api/sessions/current` <br/>
**Description**: Perform logout <br/>
**Sample request**: <br/>
```http
DELETE http://localhost:3001/api/sessions/current 
```
**Sample response**: <br/>
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Date: Fri, 04 Jun 2021 11:05:39 GMT
Connection: close
Transfer-Encoding: chunked
```

### Retrieve all the tasks of the logged user

**HTTP Method**: `GET` <br/>
**URL**: `/api/tasks` <br/>
**Description**: Retrieve the list of all the tasks of the logged user <br/>
**Sample request**: <br/>
```http
GET http://localhost:3001/api/tasks 
```
**Sample response**: <br/>
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 254
ETag: W/"fe-RHteZ7Eezeekq7cHB0l5UGD8RG8"
Date: Tue, 18 May 2021 15:44:49 GMT
Connection: close

[
  {
    "id": 1,
    "description": "Check if the pen is on the table",
    "important": 0,
    "priv": 0,
    "deadline": "2021-05-18T00:00",
    "completed": 0,
    "user": 1
  },
  {
    "id": 2,
    "description": "Study WA1!!",
    "important": 1,
    "priv": 1,
    "deadline": "2021-06-29T02:27",
    "completed": 0,
    "user": 1
  }
]
```
**Error response(s)**: <br/>
```http
HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 33
ETag: W/"21-UzcdDMGWMF3srq/QTjzKuqhU/E4"
Date: Mon, 17 May 2021 19:23:30 GMT
Connection: close

{
  "errno": 1,
  "code": "SQLITE_ERROR"
}
```

### Retrieve all the important tasks of the logged user

**HTTP Method**: `GET` <br/>
**URL**: `/api/tasks/filter=important` <br/>
**Description**: Retrieve the list of all the important tasks of the logged user<br/>
**Sample request**: <br/>
```http
GET http://localhost:3001/api/tasks/filter=important
```
**Sample response**: <br/>
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 117
ETag: W/"75-1ROOZ+eUbcjvmKdfo8vtz98gJUU"
Date: Tue, 18 May 2021 15:53:04 GMT
Connection: close

[
  {
    "id": 2,
    "description": "Study WA1!!",
    "important": 1,
    "priv": 1,
    "deadline": "2021-06-29T02:27",
    "completed": 0,
    "user": 1
  }
]
```
**Error response(s)**: <br/>
```http
HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 33
ETag: W/"21-UzcdDMGWMF3srq/QTjzKuqhU/E4"
Date: Mon, 17 May 2021 19:23:30 GMT
Connection: close

{
  "errno": 1,
  "code": "SQLITE_ERROR"
}
```

### Retrieve all the private tasks of the logged user

**HTTP Method**: `GET` <br/>
**URL**: `/api/tasks/filter=private` <br/>
**Description**: Retrieve the list of all the private tasks of the logged user<br/>
**Sample request**: <br/>
```http
GET http://localhost:3001/api/tasks/filter=private
```
**Sample response**: <br/>
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 117
ETag: W/"75-1ROOZ+eUbcjvmKdfo8vtz98gJUU"
Date: Tue, 18 May 2021 15:53:04 GMT
Connection: close

[
  {
    "id": 2,
    "description": "Study WA1!!",
    "important": 1,
    "priv": 1,
    "deadline": "2021-06-29T02:27",
    "completed": 0,
    "user": 1
  }
]
```
**Error response(s)**: <br/>
```http
HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 33
ETag: W/"21-UzcdDMGWMF3srq/QTjzKuqhU/E4"
Date: Mon, 17 May 2021 19:23:30 GMT
Connection: close

{
  "errno": 1,
  "code": "SQLITE_ERROR"
}
```

### Retrieve all tasks of the logged user whose deadline is today

**HTTP Method**: `GET` <br/>
**URL**: `/api/tasks/filter=today` <br/>
**Description**: Retrieve the list of tasks of the logged user whose deadline is today <br/>
**Sample request**: <br/>
```http
GET http://localhost:3001/api/tasks/filter=today
```
**Sample response**: <br/>
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 117
ETag: W/"75-1ROOZ+eUbcjvmKdfo8vtz98gJUU"
Date: Tue, 18 May 2021 15:53:04 GMT
Connection: close

[
  {
    "id": 2,
    "description": "Study WA1!!",
    "important": 1,
    "priv": 1,
    "deadline": "2021-05-18T18:27",
    "completed": 0,
    "user": 1
  }
]
```
**Error response(s)**: <br/>
```http
HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 33
ETag: W/"21-UzcdDMGWMF3srq/QTjzKuqhU/E4"
Date: Mon, 17 May 2021 19:23:30 GMT
Connection: close

{
  "errno": 1,
  "code": "SQLITE_ERROR"
}
```

### Retrieve all tasks of the logged user whose deadline is in the next 7 days

**HTTP Method**: `GET` <br/>
**URL**: `/api/tasks/filter=next7days` <br/>
**Description**: Retrieve the list of tasks of the logged user whose deadline is in the next 7 days <br/>
**Sample request**: <br/>
```http
GET http://localhost:3001/api/tasks/filter=next7days
```
**Sample response**: <br/>
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 117
ETag: W/"75-1ROOZ+eUbcjvmKdfo8vtz98gJUU"
Date: Tue, 18 May 2021 15:53:04 GMT
Connection: close

[
  {
    "id": 2,
    "description": "Study WA1!!",
    "important": 1,
    "priv": 1,
    "deadline": "2021-05-20T18:27",
    "completed": 0,
    "user": 1
  }
]
```
**Error response(s)**: <br/>
```http
HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 33
ETag: W/"21-UzcdDMGWMF3srq/QTjzKuqhU/E4"
Date: Mon, 17 May 2021 19:23:30 GMT
Connection: close

{
  "errno": 1,
  "code": "SQLITE_ERROR"
}
```

### Retrieve a task of the logged user given its id

**HTTP Method**: `GET` <br/>
**URL**: `/api/tasks/:id` <br/>
**Description**: Retrieve a task of the logged user given its id <br/>
**Sample requests**: <br/>
```http
GET http://localhost:3001/api/tasks/1
```
```http
GET http://localhost:3001/api/tasks/1a
```
```http
GET http://localhost:3001/api/tasks/1223
```
**Sample response**: <br/>
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 136
ETag: W/"88-tIay7SDqNRiP4hnX04/cgNd7MKY"
Date: Tue, 18 May 2021 16:01:19 GMT
Connection: close

{
  "id": 1,
  "description": "Check if the pen is on the table",
  "important": 0,
  "priv": 0,
  "deadline": "2021-05-18T00:00",
  "completed": 0,
  "user": 1
}
```
**Error response(s)**: <br/>
```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 93
ETag: W/"5d-Xyf2MUHjdHBSE5E3fvcrC3dCn/g"
Date: Tue, 18 May 2021 16:01:55 GMT
Connection: close

{
  "errors": [
    {
      "value": "1a",
      "msg": "Must be an integer value",
      "param": "id",
      "location": "params"
    }
  ]
}
```
```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 182
ETag: W/"b6-EocSyYJtBhQOtZBkJGpMEezmFM8"
Date: Tue, 18 May 2021 16:05:38 GMT
Connection: close

{
  "errors": [
    {
      "value": "1223",
      "msg": "The specified id does not point to any resource on the server. Please be sure to use the id of an existing task",
      "param": "id",
      "location": "params"
    }
  ]
}
```
```http
HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 33
ETag: W/"21-UzcdDMGWMF3srq/QTjzKuqhU/E4"
Date: Mon, 17 May 2021 19:23:30 GMT
Connection: close

{
  "errno": 1,
  "code": "SQLITE_ERROR"
}
```

### Create a new task

**HTTP Method**: `POST` <br/>
**URL**: `/api/tasks` <br/>
**Description**: Create a new resource with the new task <br/>
**Sample requests**: <br/>
```http
POST http://localhost:3001/api/tasks
Content-Type: application/json

{
	"description": "Check if the pen is on the table",
	"important": false,
	"priv": false,
	"deadline": "2021-05-30T15:00",
	"completed": false
}
```
```http
POST http://localhost:3001/api/tasks
Content-Type: application/json

{
	"description": "Hi",
	"important": true,
	"priv": true,
	"deadline": "1",
	"completed": 3
}
```
**Sample response**: <br/>
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Location: http://localhost:3001/api/tasks/9
Content-Type: application/json; charset=utf-8
Content-Length: 102
ETag: W/"66-KoO+qCS+VVPHmitJJkHc07L5LuE"
Date: Tue, 18 May 2021 16:13:20 GMT
Connection: close

{
  "id of the new task": 9,
  "outcome": "success, see Location header for the location of the new resource"
}
```
**Error response(s)**: <br/>
```http
HTTP/1.1 422 Unprocessable Entity
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 427
ETag: W/"1ab-KI6xEKRAvq/OrE0iarjOTdjc3Gg"
Date: Tue, 18 May 2021 19:02:31 GMT
Connection: close

{
  "errors": [
    {
      "value": 3,
      "msg": "Must be a boolean (true/false)",
      "param": "completed",
      "location": "body"
    },
    {
      "value": "1",
      "msg": "Must be either null or a deadline represented as a string in the format YYYY-MM-DD[T]HH:mm",
      "param": "deadline",
      "location": "body"
    },
    {
      "value": "Hi",
      "msg": "Must be at least 5 chars long",
      "param": "description",
      "location": "body"
    }
  ]
}
```
```http
HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 33
ETag: W/"21-UzcdDMGWMF3srq/QTjzKuqhU/E4"
Date: Mon, 17 May 2021 19:23:30 GMT
Connection: close

{
  "errno": 1,
  "code": "SQLITE_ERROR"
}
```

### Update a task of the logged user

**HTTP Method**: `PUT` <br/>
**URL**: `/api/tasks/:id` <br/>
**Description**: Update an existing task of the logged user (it includes the "mark as completed" operation)<br/>
**Sample requests**: <br/>
```http
PUT http://localhost:3001/api/tasks/4
Content-Type: application/json

{
	"description": "Study WA1!!",
	"important": true,
	"priv": true,
	"deadline": "2021-06-29T02:27",
	"completed": 0
}
```
```http
PUT http://localhost:3001/api/tasks/a
Content-Type: application/json

{
	"description": "Study WA1!!",
	"important": true,
	"priv": 6,
	"deadline": 77,
	"completed": 0
}
```
```http
PUT http://localhost:3001/api/tasks/400
Content-Type: application/json

{
	"description": "Study WA1!!",
	"important": true,
	"priv": true,
	"deadline": "2021-06-29T02:27",
	"completed": 0
}
```
**Sample response**: <br/>
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 50
ETag: W/"32-DfF0jlNOzeFAslXV+Ywwqp7f9ec"
Date: Tue, 18 May 2021 19:07:36 GMT
Connection: close

{
  "id of the updated task": "4",
  "outcome": "success"
}
```
**Error response(s)**: <br/>
```http
HTTP/1.1 422 Unprocessable Entity
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 413
ETag: W/"19d-Ynwecp9PGFfJLGZT71jC5vOeq0s"
Date: Tue, 18 May 2021 19:29:38 GMT
Connection: close

{
  "errors": [
    {
      "value": "a",
      "msg": "Must be an integer value",
      "param": "id",
      "location": "params"
    },
    {
      "value": 6,
      "msg": "Must be a boolean (true/false)",
      "param": "private",
      "location": "body"
    },
    {
      "value": 77,
      "msg": "Must be either null or a deadline represented as a string in the format YYYY-MM-DD[T]HH:mm",
      "param": "deadline",
      "location": "body"
    }
  ]
}
```
```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 181
ETag: W/"b5-xq7OJIwL27exXxD3pXytHmxseIo"
Date: Tue, 18 May 2021 19:31:34 GMT
Connection: close

{
  "errors": [
    {
      "value": "400",
      "msg": "The specified id does not point to any resource on the server. Please be sure to use the id of an existing task",
      "param": "id",
      "location": "params"
    }
  ]
}
```
```http
HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 33
ETag: W/"21-UzcdDMGWMF3srq/QTjzKuqhU/E4"
Date: Mon, 17 May 2021 19:23:30 GMT
Connection: close

{
  "errno": 1,
  "code": "SQLITE_ERROR"
}
```

### Delete a task of the logged user given its id

**HTTP Method**: `DELETE` <br/>
**URL**: `/api/tasks/:id` <br/>
**Description**: Delete a task of the logged user given its id <br/>
**Sample requests**: <br/>
```http
DELETE http://localhost:3001/api/tasks/2
```
```http
DELETE http://localhost:3001/api/tasks/2a
```
```http
DELETE http://localhost:3001/api/tasks/2233
```
**Sample response**: <br/>
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 50
ETag: W/"32-4V9FuLpUADyh4aMeGwrTWH12RUA"
Date: Tue, 18 May 2021 19:11:44 GMT
Connection: close

{
  "id of the deleted task": "2",
  "outcome": "success"
}
```
**Error response(s)**: <br/>
```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 93
ETag: W/"5d-riCBP30vIk0DXa8F5LK1b2UOg/4"
Date: Tue, 18 May 2021 19:12:11 GMT
Connection: close

{
  "errors": [
    {
      "value": "2a",
      "msg": "Must be an integer value",
      "param": "id",
      "location": "params"
    }
  ]
}
```
```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 182
ETag: W/"b6-IgtDPBNbt6yI+FkRJUVd0FfOOfM"
Date: Tue, 18 May 2021 19:18:06 GMT
Connection: close

{
  "errors": [
    {
      "value": "2233",
      "msg": "The specified id does not point to any resource on the server. Please be sure to use the id of an existing task",
      "param": "id",
      "location": "params"
    }
  ]
}
```
```http
HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 33
ETag: W/"21-UzcdDMGWMF3srq/QTjzKuqhU/E4"
Date: Mon, 17 May 2021 19:23:30 GMT
Connection: close

{
  "errno": 1,
  "code": "SQLITE_ERROR"
}
```