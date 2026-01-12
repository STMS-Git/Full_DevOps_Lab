# DevOps Lab – Student Project (Node.js + Jira/GitHub + CI/CD)
  -  Killian BEGU -> Kostleky
  -  Eliott Alfandari -> eliooooA03
  -  Refaël Aharouni -> RefaelAharouni
  -  Alfred Abishek Anthony Cruz -> alfred1224-al

# STMS - Sports Team Management System

> Full-stack web application for managing sports teams with authentication, role-based access control, and modern interface.

[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?logo=render&logoColor=white)](https://stms-application.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)

---

## Live Application

**Access the application:** [https://stms-application.onrender.com](https://stms-application.onrender.com)

**Backend API:** [https://stms-backend-uoch.onrender.com](https://stms-backend-uoch.onrender.com)

---

## Table of Contents

- [About](#-about)
- [Features](#-features)
- [Technologies](#-technologies)
- [Architecture](#-architecture)
- [Local Installation](#-local-installation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Contributors](#-contributors)

---

## About

**STMS (Sports Team Management System)** is a full-stack web application designed to efficiently manage sports teams. It provides comprehensive features for managing coaches, teams, sports facilities, matches, and training sessions, with a robust authentication system and role-based permissions.

---

## Features

### Authentication & Authorization
- Secure registration and login (JWT-based)
- Role management: **Coach** and **Player**
- Role-based permissions
- Persistent sessions

### 👥 Entity Management

#### For Coaches (full access)
- Create, edit, and delete coaches
- Manage teams and their members
- Add and configure sports facilities
- Schedule matches and training sessions
- View global statistics

#### For Players (read-only access)
- View coaches list
- See teams and their compositions
- Access available facilities
- View match and training schedules

### Interactive Dashboard
- Real-time statistics
- Data overview
- Intuitive navigation

---

## Technologies

### Frontend
- **React 18** - UI Library
- **React Router 6** - Client-side routing
- **Vite** - Modern and fast build tool
- **PropTypes** - Props validation

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

### Testing
- **Vitest** - Unit testing framework
- **Supertest** - HTTP API testing
- **MongoDB Memory Server** - Test database

### DevOps
- **GitHub Actions** - CI/CD
- **Render** - Cloud hosting
- **ESLint** - JavaScript linter

---

## Architecture

```

┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│  React App (https://stms-application.onrender.com)          │
│  - Pages (Login, Dashboard, Entities)                       │
│  - Components (Forms, Lists)                                │
│  - Context (AuthContext)                                    │
└────────────────────┬────────────────────────────────────────┘
│ HTTP Requests (REST API)
↓
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND API                             │
│  Express Server (https://stms-backend-uoch.onrender.com)    │
│  - Routes (Auth, Coaches, Teams, etc.)                      │
│  - Middleware (Auth, Error Handler)                         │
│  - Models (User, Coach, Team, etc.)                         │
└────────────────────┬────────────────────────────────────────┘
│ Mongoose ODM
↓
┌─────────────────────────────────────────────────────────────┐
│                        DATABASE                              │
│                    MongoDB Atlas                             │
│  - Users, Coaches, Teams, Facilities                        │
│  - MatchSessions, TrainingSessions                          │
└─────────────────────────────────────────────────────────────┘

```

---

## Local Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git

### 1️. Clone the repository

```bash
git clone https://github.com/STMS-Git/Full_DevOps_Lab.git
cd Full_DevOps_Lab
```


### 2. Install backend dependencies

```bash
npm install
```


### 3. Configure environment variables

Create a `.env` file at the root:

```bash
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/stms?retryWrites=true&w=majority
JWT_SECRET=your_super_long_and_secure_jwt_secret
```


### 4. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```


### 5. Run the application

**Terminal 1 - Backend:**

```bash
npm run dev
```

Server starts at `http://localhost:3000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Application opens at `http://localhost:5173`

---

## Testing

### Run all tests

```bash
npm test
```


### Tests with coverage

```bash
npm run test:coverage
```


### Tests in watch mode

```bash
npm run test:watch
```


### Expected results

```
Total: 144 tests passing

Coverage:

File                            | % Stmts | % Branch | % Funcs | % Lines |
--------------------------------|---------|----------|---------|---------|
All files                       |   94.09 |    92.06 |   97.56 |   94.04 
```


---

## Deployment

### Render Configuration

The project uses **Render** for hosting with automatic deployment from GitHub.

#### Backend (Web Service)

- **URL**: `https://stms-backend-uoch.onrender.com`
- **Runtime**: Node.js
- **Build**: `npm install`
- **Start**: `npm start`


#### Frontend (Static Site)

- **URL**: `https://stms-application.onrender.com`
- **Root Directory**: `frontend`
- **Build**: `npm install && npm run build`
- **Publish**: `dist`


### Required environment variables

**Backend:**

```
NODE_ENV=production
PORT=10000
MONGODB_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<your_jwt_secret>
```

**Frontend:**

```
VITE_API_URL=https://stms-backend-uoch.onrender.com
```


### Automatic deployment

Every push to the `main` branch automatically triggers:

1. Tests via GitHub Actions
2. Frontend and backend build
3. Deployment to Render

---

## Project Structure

```
Full_DevOps_Lab/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI/CD
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CoachForm.jsx
│   │   │   ├── CoachList.jsx
│   │   │   ├── TeamForm.jsx
│   │   │   ├── TeamList.jsx
│   │   │   ├── FacilityForm.jsx
│   │   │   ├── FacilityList.jsx
│   │   │   ├── MatchForm.jsx
│   │   │   ├── MatchList.jsx
│   │   │   ├── TrainingForm.jsx
│   │   │   ├── TrainingList.jsx
│   │   │   ├── Navigation.jsx
│   │   │   └── Header.jsx
│   │   ├── config/
│   │   │   └── api.js                # API URL configuration
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Authentication context
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── CoachesPage.jsx
│   │   │   ├── TeamsPage.jsx
│   │   │   ├── FacilitiesPage.jsx
│   │   │   ├── MatchesPage.jsx
│   │   │   └── TrainingsPage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.local                    # Frontend environment variables
│   ├── vite.config.js
│   └── package.json
├── src/
│   ├── config/
│   │   └── database.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── coachController.js
│   │   ├── facilityController.js
│   │   ├── matchSessionController.js
│   │   ├── teamController.js
│   │   └── trainingSessionController.js
│   ├── middleware/
│   │   └── authMiddleware.js         # JWT authentication
│   ├── models/
│   │   ├── User.js
│   │   ├── Coach.js
│   │   ├── Facility.js
│   │   ├── MatchSession.js
│   │   ├── Team.js
│   │   └── TrainingSession.js
│   ├── routes/
│   │   └── auto/
│   │       ├── auth.route.js
│   │       ├── coaches.route.js
│   │       ├── facilities.route.js
│   │       ├── matchSessions.route.js
│   │       ├── teams.route.js
│   │       └── trainingSessions.route.js
│   ├── utils/
│   ├── app.js                        # Express app configuration
│   └── index.js                      # Server entry point
├── test/
│   ├── auth.test.js
│   ├── coaches.test.js
│   ├── facilities.test.js
│   ├── health.test.js
│   ├── matchSessions.test.js
│   ├── teams.test.js
│   └── trainingSessions.test.js
├── .env                              # Backend environment variables (not in git)
├── .env.example                      # Environment variables template
├── .eslintrc.cjs
├── .gitignore
├── package.json
├── render.yaml                       # Render deployment config
└── vitest.config.js
```


---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
| :-- | :-- | :-- |
| POST | `/auth/register` | Create a user account |
| POST | `/auth/login` | Log in |

### Coaches

| Method | Endpoint | Description | Access |
| :-- | :-- | :-- | :-- |
| GET | `/coaches` | List all coaches | All |
| GET | `/coaches/:id` | Get coach details | All |
| POST | `/coaches` | Create a coach | Coach only |
| PUT | `/coaches/:id` | Update a coach | Coach only |
| DELETE | `/coaches/:id` | Delete a coach | Coach only |

### Teams

| Method | Endpoint | Description | Access |
| :-- | :-- | :-- | :-- |
| GET | `/teams` | List all teams | All |
| GET | `/teams/:id` | Get team details | All |
| POST | `/teams` | Create a team | Coach only |
| PUT | `/teams/:id` | Update a team | Coach only |
| DELETE | `/teams/:id` | Delete a team | Coach only |

### Facilities

| Method | Endpoint | Description | Access |
| :-- | :-- | :-- | :-- |
| GET | `/facilities` | List all facilities | All |
| GET | `/facilities/:id` | Get facility by ID | All |
| POST | `/facilities` | Create a facility | Coach only |
| PUT | `/facilities/:id` | Update a facility | Coach only |
| DELETE | `/facilities/:id` | Delete a facility | Coach only |

### Match Sessions

| Method | Endpoint | Description | Access |
| :-- | :-- | :-- | :-- |
| GET | `/matchSessions` | List all matches | All |
| GET | `/matchSessions/:id` | Get match by ID | All |
| POST | `/matchSessions` | Create a match | Coach only |
| PUT | `/matchSessions/:id` | Update a match | Coach only |
| DELETE | `/matchSessions/:id` | Delete a match | Coach only |

### Training Sessions

| Method | Endpoint | Description | Access |
| :-- | :-- | :-- | :-- |
| GET | `/trainingSessions` | List all trainings | All |
| GET | `/trainingSessions/:id` | Get training by ID | All |
| POST | `/trainingSessions` | Create a training | Coach only |
| PUT | `/trainingSessions/:id` | Update a training | Coach only |
| DELETE | `/trainingSessions/:id` | Delete a training | Coach only |


---

## Contributors

- **STMS Team** - Initial development

---

## Acknowledgments

- MongoDB Atlas for database hosting
- Render for application hosting
- The React and Node.js community

---

**If you like this project, don't hesitate to give it a star!**
