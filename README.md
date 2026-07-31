# Web-Based Queue Optimization System for University Administrative Services

A full-stack web application developed as part of the **Master of Computer Science** program at **IU International University of Applied Sciences**.

The project aims to improve the efficiency of university administrative services by replacing traditional physical queues with a digital queue management system. Students can generate queue tokens, monitor their queue status in real time, and receive updates through a modern web interface. Administrative staff can efficiently manage departments and process queue requests through a dedicated dashboard.

---

## Features

### Student

- User registration and login
- Generate digital queue tokens
- Select administrative departments
- View queue status in real time
- Track queue history
- Manage user profile

### Administrator

- Secure administrator login
- Department management
- Queue management
- Process student requests
- Update queue status
- View queue history

---

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend

- FastAPI
- Python
- JWT Authentication
- REST API
- WebSocket

### Database

- MongoDB

---

## Project Structure

```text
smart_queue_management_system/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── database/
│   └── requirements.txt
│
├── testing-screenshots/
│
└── README.md
```

---

## How the System Works

1. Students register and log in.
2. A department is selected.
3. A digital queue token is generated.
4. Students can monitor their queue position in real time.
5. Administrators process requests through the admin dashboard.
6. Queue updates are synchronized instantly using WebSocket communication.

---

## Installation

### Clone the repository

```bash
git clone https://github.com/uday-kiran-web-dev/smart_queue_management_system.git
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## Environment Variables

Create a `.env` file for the backend.

Example:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secret_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## Live Demo

Frontend

https://sqms-one.vercel.app/

Backend API

https://sqms-server-332602862308.europe-west1.run.app/

Swagger Documentation

https://sqms-server-332602862308.europe-west1.run.app/docs

---

## Screenshots

The `testing-screenshots` folder contains screenshots of the application, including:

- Student Dashboard
- Department Selection
- Administrator Dashboard
- Queue Management
- Authentication
- Queue Tracking

---

## Future Improvements

Some planned enhancements include:

- Appointment scheduling
- University Single Sign-On (SSO)
- Mobile application
- Email notifications
- Waiting time estimation
- Analytics dashboard

---

## Author

**Uday Kiran Chirra**

Master of Computer Science

IU International University of Applied Sciences

---

## License

This project was developed for academic purposes as part of the Computer Science Project module at IU International University of Applied Sciences.
