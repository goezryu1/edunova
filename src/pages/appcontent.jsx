import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

const INITIAL_STATE = {
  user: {
    name: 'Alex Chen',
    username: '@alexchen',
    avatar: null,
    level: 12,
    xp: 3840,
    xpNext: 5000,
    streak: 7,
    joinDate: '2024-09-01',
    bio: 'CS Major · Dean\'s List · Coffee addict',
    accentColor: '#00f5ff',
    badges: ['Early Adopter', 'Week Streak', 'Quiz Master'],
  },
  notifications: [
    { id: 1, type: 'achievement', msg: 'You earned "7-Day Streak"!', time: '2m ago', read: false },
    { id: 2, type: 'quiz', msg: 'Quiz due: Algorithms midterm', time: '1h ago', read: false },
    { id: 3, type: 'study', msg: 'Study session starting in 10min', time: '3h ago', read: true },
  ],
  assignments: [
    { id: 1, title: 'Data Structures Essay', course: 'CS301', due: '2025-06-15', priority: 'high', done: false, progress: 60 },
    { id: 2, title: 'Calculus Problem Set', course: 'MATH201', due: '2025-06-13', priority: 'urgent', done: false, progress: 30 },
    { id: 3, title: 'History Reading Response', course: 'HIST110', due: '2025-06-18', priority: 'medium', done: false, progress: 0 },
    { id: 4, title: 'Physics Lab Report', course: 'PHYS202', due: '2025-06-20', priority: 'low', done: true, progress: 100 },
  ],
  schedule: [
    { id: 1, course: 'Data Structures', code: 'CS301', day: 1, startH: 9, duration: 1.5, color: '#00f5ff', room: 'BH 204', prof: 'Dr. Rivera' },
    { id: 2, course: 'Linear Algebra', code: 'MATH201', day: 1, startH: 11, duration: 1, color: '#7c3aed', room: 'MC 101', prof: 'Prof. Kim' },
    { id: 3, course: 'Physics', code: 'PHYS202', day: 2, startH: 10, duration: 1.5, color: '#00ff88', room: 'SCI 301', prof: 'Dr. Patel' },
    { id: 4, course: 'History', code: 'HIST110', day: 3, startH: 14, duration: 1, color: '#fbbf24', room: 'HUM 102', prof: 'Prof. Adams' },
    { id: 5, course: 'Data Structures', code: 'CS301', day: 3, startH: 9, duration: 1.5, color: '#00f5ff', room: 'BH 204', prof: 'Dr. Rivera' },
    { id: 6, course: 'Algorithms', code: 'CS401', day: 4, startH: 13, duration: 1.5, color: '#f0abfc', room: 'BH 301', prof: 'Dr. Wang' },
  ],
  grades: [
    { id: 1, course: 'Data Structures', code: 'CS301', grade: 91, credits: 3, letter: 'A-' },
    { id: 2, course: 'Linear Algebra', code: 'MATH201', grade: 87, credits: 3, letter: 'B+' },
    { id: 3, course: 'Physics', code: 'PHYS202', grade: 78, credits: 4, letter: 'C+' },
    { id: 4, course: 'History', code: 'HIST110', grade: 95, credits: 3, letter: 'A' },
    { id: 5, course: 'Algorithms', code: 'CS401', grade: 83, credits: 3, letter: 'B' },
  ],
  flashcards: [
    { id: 1, deck: 'Data Structures', front: 'What is a Binary Search Tree?', back: 'A tree where each node has at most two children, and all left subtree values are less than the node, all right subtree values are greater.' },
    { id: 2, deck: 'Data Structures', front: 'Time complexity of BST search?', back: 'Average: O(log n), Worst case: O(n) for unbalanced tree.' },
    { id: 3, deck: 'Algorithms', front: 'What is Dynamic Programming?', back: 'An optimization technique that solves complex problems by breaking them into overlapping subproblems and storing results to avoid redundant computation.' },
    { id: 4, deck: 'Math', front: 'Eigenvalue definition', back: 'A scalar λ such that Av = λv for some non-zero vector v. Represents scaling factor along eigenvector direction.' },
  ],
  studyRooms: [
    { id: 1, name: 'CS Study Squad', members: 5, maxMembers: 8, topic: 'Algorithms Final', active: true, avatar: '🧠' },
    { id: 2, name: 'Math Grind Session', members: 3, maxMembers: 6, topic: 'Linear Algebra Ch. 7', active: true, avatar: '📐' },
    { id: 3, name: 'Physics Lab Prep', members: 2, maxMembers: 4, topic: 'Wave Optics', active: false, avatar: '⚛️' },
  ],
  leaderboard: [
    { rank: 1, name: 'Sarah K.', xp: 12400, streak: 23, avatar: '👑' },
    { rank: 2, name: 'Marcus T.', xp: 11200, streak: 15, avatar: '🔥' },
    { rank: 3, name: 'Alex Chen', xp: 9800, streak: 7, avatar: '⚡', isYou: true },
    { rank: 4, name: 'Priya M.', xp: 9200, streak: 12, avatar: '🌟' },
    { rank: 5, name: 'James L.', xp: 8900, streak: 9, avatar: '💎' },
    { rank: 6, name: 'Aiko T.', xp: 8100, streak: 5, avatar: '🚀' },
    { rank: 7, name: 'Chris B.', xp: 7600, streak: 3, avatar: '🎯' },
  ],
  achievements: [
    { id: 1, title: '7-Day Streak', desc: 'Study 7 days in a row', icon: '🔥', earned: true, xp: 200 },
    { id: 2, title: 'Quiz Master', desc: 'Score 100% on 5 quizzes', icon: '🎯', earned: true, xp: 500 },
    { id: 3, title: 'Note Wizard', desc: 'Create 50 AI notes', icon: '✨', earned: false, xp: 300, progress: 32, total: 50 },
    { id: 4, title: 'Grind Mode', desc: '24 hours of total study time', icon: '💪', earned: false, xp: 400, progress: 18, total: 24 },
    { id: 5, title: 'Social Learner', desc: 'Join 10 group study rooms', icon: '🤝', earned: false, xp: 250, progress: 4, total: 10 },
    { id: 6, title: 'Perfect Week', desc: 'Complete all tasks in a week', icon: '⭐', earned: false, xp: 600, progress: 5, total: 7 },
    { id: 7, title: 'Flash Champion', desc: 'Review 200 flashcards', icon: '⚡', earned: true, xp: 350 },
    { id: 8, title: 'Early Bird', desc: 'Study before 7am (5 times)', icon: '🌅', earned: false, xp: 300, progress: 2, total: 5 },
  ],
  pomodoroSettings: { work: 25, shortBreak: 5, longBreak: 15 },
  notes: [
    { id: 1, title: 'Binary Trees Summary', content: 'Binary trees are hierarchical data structures...', course: 'CS301', tags: ['trees', 'data-structures'], created: '2025-06-10', aiGenerated: true },
    { id: 2, title: 'Newton\'s Laws Recap', content: '1st Law: Object in motion stays in motion...', course: 'PHYS202', tags: ['physics', 'mechanics'], created: '2025-06-08', aiGenerated: false },
  ],
  aiChatHistory: [],
};

function loadState() {
  try {
    const saved = localStorage.getItem('nexus_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...INITIAL_STATE, ...parsed };
    }
  } catch {}
  return INITIAL_STATE;
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Persist to localStorage
  useEffect(() => {
    try {
      const { aiChatHistory: _, ...persist } = state;
      localStorage.setItem('nexus_state', JSON.stringify(persist));
    } catch {}
  }, [state]);

  const update = useCallback((key, val) => {
    setState(s => ({ ...s, [key]: typeof val === 'function' ? val(s[key]) : val }));
  }, []);

  const addToast = useCallback((msg, type = 'info', duration = 3500) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
  }, []);

  const markNotifRead = useCallback((id) => {
    update('notifications', n => n.map(x => x.id === id ? { ...x, read: true } : x));
  }, [update]);

  const addXP = useCallback((amount) => {
    setState(s => {
      const newXP = s.user.xp + amount;
      const levelUp = newXP >= s.user.xpNext;
      return {
        ...s,
        user: {
          ...s.user,
          xp: levelUp ? newXP - s.user.xpNext : newXP,
          level: levelUp ? s.user.level + 1 : s.user.level,
          xpNext: levelUp ? Math.round(s.user.xpNext * 1.4) : s.user.xpNext,
        }
      };
    });
    addToast(`+${amount} XP earned! ✨`, 'xp');
  }, [addToast]);

  return (
    <AppCtx.Provider value={{
      ...state,
      activePage, setActivePage,
      sidebarOpen, setSidebarOpen,
      toasts, addToast,
      update, markNotifRead, addXP,
    }}>
      {children}
    </AppCtx.Provider>
  );
}