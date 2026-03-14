# Freelance Client Tracking App

A full-stack application for freelancers to track clients, projects, and invoices. Built with **React (TypeScript)** and **FastAPI (Python)**.

## 🚀 Features

- **Client CRM:** Keep track of client contact information.
- **Project Management:** Track project status, deadlines, and rates.
- **Invoicing:** Generate and manage invoices for your projects.
- **Modern UI:** Built with React and a clean, responsive layout.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite, React Router, Axios.
- **Backend:** Python, FastAPI, SQLAlchemy (SQLite), Pydantic.

---

## 🏁 Getting Started

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```text
├── backend/            # FastAPI Backend
│   ├── main.py         # API Endpoints
│   ├── models.py       # SQLAlchemy Models
│   ├── schemas.py      # Pydantic Schemas
│   ├── crud.py         # DB Operations
│   └── database.py     # SQLite Config
└── frontend/           # React Frontend
    ├── src/pages/      # Application Pages
    ├── src/components/ # Shared Components
    └── src/api.ts      # API Client
```


