# 🎓 Edunova — AI Student Platform

Edunova is a futuristic, AI-powered student productivity platform built with React.
It combines smart study tools, gamification, and collaboration features into one
sleek dark-neon interface designed to make studying more effective and engaging.

---

## ✨ Features

- 🧠 **AI Study Assistant** — Chat with an AI tutor powered by Claude
- ⚡ **Quiz Generator** — Auto-generate quizzes on any topic using AI
- 📚 **Flashcard System** — Create decks and study with spaced repetition
- 📝 **AI Note-Taking** — Generate structured study notes instantly
- ✅ **Assignment Tracker** — Track deadlines, priorities, and progress
- 📅 **Class Schedule** — Visual weekly timetable organizer
- ⏱️ **Pomodoro Timer** — Focus sessions with XP rewards
- 📊 **Grade Calculator** — GPA tracking across all your courses
- 👥 **Study Rooms** — Real-time group study with live chat
- 📁 **File Sharing** — Upload and share course materials
- 📄 **PDF Summarizer** — AI-powered document analysis
- 🏆 **Achievements & Leaderboard** — Gamified XP and streak system
- 🎨 **Profile Customization** — Personalize your avatar and accent color

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Custom CSS, Glassmorphism, Neon UI |
| AI | Anthropic Claude API (claude-sonnet-4-6) |
| State | React Context + localStorage |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 🚀 Getting Started

```bash
git clone https://github.com/yourusername/edunova-ai.git
cd edunova-ai
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Live Demo

[edunova-gray.vercel.app](https://edunova.vercel.app)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/       # Sidebar, Topbar
│   └── ui/           # Toast notifications
├── context/          # Global app state
├── pages/            # All 15 page components
└── index.css         # Design system & tokens
```

---

## 🔑 Environment Variables

Create a `.env` file in the root:

```env
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

---

## 📄 License

MIT © 2026 Edunova
