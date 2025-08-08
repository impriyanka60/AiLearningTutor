# AI Learning Tutor

Run frontend with `npm run dev` in client. Run backend with `node index.js` in server.
# 🧠 AI Learning Assistant

A full-stack Generative AI-powered Learning Assistant built with the **MERN stack** and integrated with the **Gemini API** (by Google). This application provides smart learning tools like:

- ✍️ Flashcard Generator  
- 💬 AI Chatbot for Doubts  
- 💡 Code Explanation Module  
- 📸 Concept Map from Image  
- 📅 Daily Quiz Feature  
- 📊 Personalized Learning Dashboard

---

## 🚀 Tech Stack

- **Frontend:** React + Tailwind CSS  
- **Backend:** Node.js + Express  
- **Database:** MongoDB  
- **AI Engine:** Gemini API  
- **Image Uploads:** Multer / Cloudinary  
- **Authentication:** (If any – optional mention)

---

## 📂 Project Structure

📦 root
├── client/ → React frontend
├── server/ → Express backend
├── .env → Environment variables (excluded from Git)
└── README.md → Project documentation
---

## 🔑 Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ai-learning-assistant.git
   cd ai-learning-assistant

---
Setup Backend (/server):

Create a .env file in /server and add:

env
Copy
Edit
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_connection_string
PORT=5000
Install backend dependencies:

bash
Copy
Edit
cd server
npm install
Setup Frontend (/client):

bash
Copy
Edit
cd ../client
npm install
Run both:

bash
Copy
Edit
# In root directory
npm run dev
🧠 Features
Flashcard Generator: Automatically generate flashcards from notes or lecture content.

AI Chat: Ask questions and get contextual answers in real-time.

Code Explainer: Paste code snippets and get human-like explanations.

Daily Quiz: Take small daily quizzes based on selected topics.

Image-based Concept Mapping: Upload handwritten notes/diagrams and convert them to digital concept maps.

Dashboard: View your learning streaks, quiz performance, and activity stats.


