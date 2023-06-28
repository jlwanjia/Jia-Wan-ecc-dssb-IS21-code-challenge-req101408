# BC App Tracker
This is a full-stack web application for tracking product data. The backend is built with Node.js and Express, and it serves a RESTful API. The frontend is built with React and uses Axios for API requests. Data for the app is generated with the Faker.js library.

## Prerequisites
Before starting, ensure you have Node.js and npm installed on your system. You can verify this by running `node -v` and `npm -v` in your terminal.

If you don't have Node.js and npm installed, you can download them from the [Node.js website](https://nodejs.org/en/download/). Download the latest LTS version, as this is the most stable and commonly used version. Once downloaded, run the installer and follow the instructions.

## Setup
### Backend
Create a new folder on your local system and navigate into it. The method to do this will depend on your operating system:

#### On Unix-like systems (like Linux or MacOS), you can use:
```bash
mkdir bc-app-tracker

cd bc-app-tracker

```
#### On Windows, you can use the File Explorer to manually create a new folder, or use the Command Prompt:
```
md bc-app-tracker

cd bc-app-tracker

```

Initialize a new Node.js application:
```
npm init -y
```
Install the necessary libraries:
```
npm install express cors
npm install faker@5.5.3
npm install swagger-ui-express swagger-jsdoc
```
### Frontend
The client directory is already present in the repository. Navigate into the client directory:
```
cd client
```
Install necessary packages:
```
npm install styled-components@5.3.10
npm install axios
```
## Running the project
You will now have two applications to run, the server, and the client.

Open a terminal, navigate to your bc-app-tracker folder and run:

```
node server.js
```
Your server should now be running on http://localhost:3000.

Open a new terminal, navigate to the client folder inside your bc-app-tracker folder and run:
```
npm start
```
Your client application should now be running on http://localhost:3001.

## API Documentation
The API documentation can be found at http://localhost:3000/api-docs/ after the server is started.
