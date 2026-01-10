# Seek Marine

Ever seen a marine creature and wondered what it is? **Seek Marine** will let you know!

**Seek Marine** is a full-stack AI-powered marine species identifier that lets you take or upload a photo and instantly receive a prediction. Inspired by iNaturalist’s Seek app, this project is designed for educational and environmental awareness, and currently supports 23 animal species. Eventually, I want to turn this into a tool for deep-sea creature identification!

<div align="center">
  <img src="https://github.com/user-attachments/assets/c76f7a35-9077-4e0e-b172-f1cf7f05ce43" width="30%" />
  <img src="https://github.com/user-attachments/assets/2d38c45a-ba2f-4b7b-9e83-e1a2adb3c8f7" width="30%" />
  <img src="https://github.com/user-attachments/assets/1f3ad0b6-40d1-469d-9836-81a6b0afbe65" width="30%" />
</div>

Built with **FastAPI** (backend) and **React + Vite + TypeScript + Tailwind CSS** (frontend).  

---

## Features

- Upload or take a photo on your device
- Predict 23 marine species using a trained TensorFlow model 
- Instant inference via FastAPI backend
- Responsive and intuitive UI with React + Tailwind CSS
- Frontend-backend integration via REST

---

## Project Structure

``` bash
seek-marine/
├── backend/          
│   ├── main.py
│   ├── model_inception.h5
│   ├── requirements.txt
│   ├── utils.py
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── .env.example
├── .gitignore
├── README.md
```
---

## Local Setup

1. Clone repository
``` bash
git clone https://github.com/beepboopdylan/seek-marine.git
cd seek-marine
```

2. Run the backend (FastAPI)
``` bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # On Windows: .\.venv\Scripts\activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

3. Run the frontend (React + Vite)
``` bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```
Then open in your browser: http://localhost:5173

4. Environment Variables
Create a .env file inside the frontend/ folder:
``` bash
VITE_API_BASE=http://127.0.0.1:8000
```
Change it to your deployed backend URL if hosting.

## Model Info
- **Path**: backend/model_inception.h5
- **Framework**: TensorFlow
- **Input**: Image (auto-preprocessed to 224×224)
- **Output**: Outputs one of 23 marine species
