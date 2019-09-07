# Web-Application-in-house-project !!!
## Setup
To run this project, install it locally using npm:

```
$ npm install
$ npm heroku-postbuild
$ npm start
```
## Architecture
This project follows the MERN architecture with the database in MongoDB, backend in Node.js and Express.js, and frontend in React. Furthermore, this project has been hosted on Heroku [here](https://webapp-inhouse.herokuapp.com/)
## Structure
Code organization is as follows
* Backend
  * server.js is the root server file
  * sites.model.js defines the MongoDB schema
  * files inside the folder routers/ are Express routers for handling requests to the server
* Frontend
  * files inside the client/ folder form the React frontend
