# Decision Support Tool — Quick Start

A small app with:
- **Backend:** FastAPI + MongoDB Atlas  
- **Frontend:** Vite + React (TypeScript)
- **VS Code:** (or any other IDE) — optional but recommended


---

## 1) Requirements
- **Python 3.11+**
- **Node.js 18+** (includes npm)

---

## 2) Folder Structure
```

Decision_Support_Tool/
├─ backend/                 # FastAPI API
│  ├─ main.py
│  ├─ database.py           # uses MongoDB Atlas
│  ├─ requirements.txt
│  └─ .env                  # MongoDB connection string (create this)
└─ client/                  # React app (Vite)
   ├─ public/
   ├─ src/
   └─ package.json

```

---

## 3) Database Setup

### Create environment file
In the `backend/` folder, create a `.env` file with your MongoDB Atlas connection string:
```bash
MONGODB_URI=your_mongodb_connection_string_here
```

> ⚠️ **Important:** Replace the connection string with your actual MongoDB Atlas credentials.

### Example format:
```bash
MONGODB_URI=mongodb+srv://mscuser:mscpassword@cluster0.na62tfc.mongodb.net/cyberdb?retryWrites=true&w=majority&appName=Cluster0
```

## 4) Start the Backend (API)

### Step 1 — Go to the backend folder
```bash
cd backend
````

### Step 2 — Install dependencies
````
pip install -r requirements.txt
````

### Step 3 — Go back to the project root
````
cd ..
````

### Step 4 — Start the backend
````
uvicorn backend.main:app --reload --port 8000
````


Open Swagger API docs in your browser:
**[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

> **Database:** The API uses MongoDB Atlas. Make sure your `.env` file is properly configured with your connection string.
---

## 5) Start the Frontend (UI)
Open a second terminal window.

### Step 1 — Go to the client folder
```bash
cd client
````

### Step 2 — Install dependencies
````
npm install
````

### Step 3 — Start the frontend
````
npm run dev
````


Open the app: **[http://localhost:5173/page1](http://localhost:5173/page1)**

> ⚠️ **Important:** You must include `/page1` at the end of the link.  
> If you only open [http://localhost:5173](http://localhost:5173) without `/page1`, the page will be blank.


The UI talks to the API at **[http://127.0.0.1:8000](http://127.0.0.1:8000)** (CORS is open; no extra setup).

---

## 6) (Optional) View the Database

If you have **MongoDB Compass** installed:
1. Open Compass.
2. Copy the connection string from `backend/.env`.
3. Paste it into Compass and click **Connect**.

If you don’t have Compass, you can use the **Atlas web UI** if you have been invited to the project.

---

## 7) Stop Everything

* Press **Ctrl + C** (Windows/Linux)  or **Cmd + C** (Mac) in each terminal window.

---

## Troubleshooting (quick)

* **Port in use (backend):**

  ```bash
  uvicorn backend.main:app --reload --port 8010
  ```
* **Node not found:** install Node.js 18+ from nodejs.org.
* **Python not found:** install Python 3.11+ from python.org.
* **MongoDB connection error:** Check your `.env` file and ensure your MongoDB Atlas credentials are correct.


---

## Notes

* Backend dependencies: `backend/requirements.txt`
* Frontend dependencies: `client/package.json`
* Project is for academic use.


---

## 📎 GitHub Repository

You can also view the full project on GitHub:  
[https://github.com/Decoder-25/Decision_Support_Tool](https://github.com/Decoder-25/Decision_Support_Tool)


