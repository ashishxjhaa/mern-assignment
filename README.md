
# MERN Assignment

This is a **MERN stack** project consisting of a backend (Node.js, Express, MongoDB) and a frontend (React.js). The application allows an admin to create and manage agents, upload lists of data, and distribute them among agents.

---

## Prerequisites

- Node.js v18+ installed
- npm
- MongoDB installed and running locally

---

## Backend Setup

1. Navigate to the backend folder:

```
bash 

cd backend

```


## Install dependencies:

npm install

## For Mac user Install dependencies:

sudo npm install


## Create a .env file in the backend/ folder with the following content:

PORT=4000
MONGO_URI=mongodb://localhost:27017/mern-assignment
JWT_SECRET=mysecret

## Start the backend server:

npm run dev || sudo npm run dev

The backend runs on http://localhost:4000

## Frontend Setup

1. Navigate to the frontend folder:

```
bash 

cd frontend

```

## Install dependencies:

npm install

## For Mac user Install dependencies:

sudo npm install

## Start the frontend server:

npm run dev || sudo npm run dev

The frontend runs on http://localhost:5173

## Usage

- Open the frontend in your browser.

- Create an admin account or login with an existing account.

- Access the dashboard to:

    * Add, edit, or delete agents.

    * Upload CSV/XLS/XLSX files.

    * View lists distributed to each agent.


## Dependencies

Backend:

    express

    mongoose

    bcryptjs

    jsonwebtoken

    cors

    multer

    csv-parser

    xlsx

    dotenv

    nodemon (dev)

Frontend:

    react

    react-router-dom

    axios

    sonner

    react-icons

---

## Features

- Admin can create and login.
- Admin can create, edit, and delete agents.
- Upload CSV/XLS/XLSX files.
- Distribute uploaded lists among agents automatically.
- Agents can view their distributed lists (through admin dashboard).
- JWT-based authentication for secure routes.
- Responsive frontend with React.js and Tailwind CSS.