import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [user, setUser] = useState({
    name: "Student",
    avatar: "👤",
    xp: 1200,
    xpNext: 2000,
    level: 5,
    streak: 3,
  });

  // Page state
  const [aiChatHistory, setAiChatHistory] = useState([]);

  const [pomodoroSettings, setPomodoroSettings] = useState({
    work: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  const [flashcards, setFlashcards] = useState([
    { id: 1, deck: 'Data Structures', front: 'What is a Binary Search Tree?', back: 'A tree where left child < parent < right child. Search/insert/delete: O(log n) average.' },
    { id: 2, deck: 'Data Structures', front: 'What is Big O notation?', back: 'Describes worst-case time/space complexity of an algorithm as input size grows.' },
    { id: 3, deck: 'Data Structures', front: 'What is a hash table?', back: 'A data structure that maps keys to values using a hash function. Average O(1) for insert, delete, lookup.' },
    { id: 4, deck: 'Linear Algebra', front: 'What is an eigenvector?', back: 'A non-zero vector that only scales (not rotates) when a linear transformation is applied to it.' },
    { id: 5, deck: 'Linear Algebra', front: 'What is a determinant?', back: 'A scalar value from a square matrix that represents the scaling factor of the linear transformation.' },
  ]);

  const [notes, setNotes] = useState([
    { id: 1, title: "Data Structures Overview", course: "CS301", tags: ["arrays", "trees"], content: "Key concepts:\n• Arrays: O(1) access\n• Linked Lists: O(n) access\n• Trees: hierarchical data", aiGenerated: false, created: "2025-06-01" },
  ]);

  const [assignments, setAssignments] = useState([
    { id: 1, title: "Binary Search Tree Implementation", course: "CS301", due: "2025-06-15", priority: "high", done: false },
    { id: 2, title: "Linear Algebra Problem Set 4", course: "MATH201", due: "2025-06-18", priority: "medium", done: false },
  ]);

  const [schedule, setSchedule] = useState([
    { id: 1, title: "CS301 Lecture", day: "Monday", time: "09:00", duration: 90, color: "#00f5ff" },
    { id: 2, title: "MATH201 Tutorial", day: "Wednesday", time: "14:00", duration: 60, color: "#8b5cf6" },
  ]);

  const [grades, setGrades] = useState([
    { id: 1, course: "CS301", assignment: "Midterm", grade: 88, total: 100, date: "2025-05-20" },
    { id: 2, course: "MATH201", assignment: "Quiz 3", grade: 74, total: 100, date: "2025-05-28" },
  ]);

  const [achievements, setAchievements] = useState([
    { id: 1, title: "First Steps",    desc: "Complete your first quiz",    icon: "🎯", earned: true,  xp: 50  },
    { id: 2, title: "Streak Master",  desc: "Maintain a 7-day streak",     icon: "🔥", earned: false, xp: 200 },
    { id: 3, title: "Note Taker",     desc: "Create 10 notes",             icon: "📝", earned: false, xp: 100 },
    { id: 4, title: "Quiz Wizard",    desc: "Score 100% on a quiz",        icon: "🧙", earned: false, xp: 150 },
  ]);

  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: "Alex Chen",  avatar: "🧠", xp: 8420, streak: 14, isYou: false },
    { rank: 2, name: "Sarah K.",   avatar: "⚡", xp: 7850, streak: 9,  isYou: false },
    { rank: 3, name: "Marcus T.",  avatar: "🔥", xp: 6920, streak: 21, isYou: false },
    { rank: 4, name: "Priya M.",   avatar: "🌟", xp: 5600, streak: 5,  isYou: false },
    { rank: 5, name: "Student",    avatar: "👤", xp: 1200, streak: 3,  isYou: true  },
    { rank: 6, name: "Jordan L.",  avatar: "💎", xp: 980,  streak: 2,  isYou: false },
  ]);

  const [studyRooms, setStudyRooms] = useState([
    { id: 1, name: "CS Study Squad",   topic: "Data Structures & Algorithms", members: 3, maxMembers: 6, active: true,  avatar: "🧠" },
    { id: 2, name: "Math Grind",       topic: "Linear Algebra Final Prep",    members: 5, maxMembers: 6, active: true,  avatar: "📐" },
    { id: 3, name: "Physics Lab Prep", topic: "Mechanics & Thermodynamics",   members: 2, maxMembers: 4, active: true,  avatar: "⚗️" },
    { id: 4, name: "Essay Workshop",   topic: "Academic Writing & Research",  members: 4, maxMembers: 8, active: false, avatar: "✍️" },
  ]);

  // Toasts 
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const addXP = (xp) => {
    setUser((prev) => ({ ...prev, xp: prev.xp + xp }));
  };

  // Generic updater: update('notes', newArray)
  const update = (key, value) => {
    const setters = {
      aiChatHistory:     setAiChatHistory,
      pomodoroSettings:  setPomodoroSettings,
      flashcards:        setFlashcards,
      notes:         setNotes,
      assignments:   setAssignments,
      schedule:      setSchedule,
      grades:        setGrades,
      achievements:  setAchievements,
      leaderboard:   setLeaderboard,
      studyRooms:    setStudyRooms,
      user:          setUser,
    };
    setters[key]?.(value);
  };

  return (
    <AppContext.Provider
      value={{
        activePage, setActivePage,
        sidebarOpen, setSidebarOpen,
        user, setUser,
        aiChatHistory,
        pomodoroSettings,
        flashcards,
        notes,
        assignments,
        schedule,
        grades,
        achievements,
        leaderboard,
        studyRooms,
        toasts,
        addXP,
        addToast,
        update,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}