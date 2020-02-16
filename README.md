This project use two ports 3000 for web interface and 4000 for the API backend. It uses reacts proxy to send
all unrouted port 3000 request to port 4000 to avoid CORS violations.

A .env files is needed for the database connection. Please see the sample.env file and create a .env file base on that
database services are in the flat files bom.js and user.js

Routes are among many directories under the src/api/v1 directory


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

