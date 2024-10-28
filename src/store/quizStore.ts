import { create } from 'zustand';
import { Quiz, QuizSession } from '../types/quiz';

interface QuizStore {
  quizzes: Quiz[];
  sessions: QuizSession[];
  addQuiz: (quiz: Quiz) => void;
  addSession: (session: QuizSession) => void;
  getQuiz: (id: string) => Quiz | undefined;
  getSession: (id: string) => QuizSession | undefined;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  quizzes: JSON.parse(localStorage.getItem('quizzes') || '[]'),
  sessions: JSON.parse(localStorage.getItem('sessions') || '[]'),
  
  addQuiz: (quiz: Quiz) => {
    set((state) => {
      const newQuizzes = [...state.quizzes, quiz];
      localStorage.setItem('quizzes', JSON.stringify(newQuizzes));
      return { quizzes: newQuizzes };
    });
  },
  
  addSession: (session: QuizSession) => {
    set((state) => {
      const newSessions = [...state.sessions, session];
      localStorage.setItem('sessions', JSON.stringify(newSessions));
      return { sessions: newSessions };
    });
  },
  
  getQuiz: (id: string) => {
    return get().quizzes.find(quiz => quiz.id === id);
  },
  
  getSession: (id: string) => {
    return get().sessions.find(session => session.id === id);
  },
}));