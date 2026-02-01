import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  notifications: Notification[];

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export const useUIStore = create<UIState>((set, get) => ({
  isSidebarOpen: true,
  isModalOpen: false,
  modalContent: null,
  notifications: [],

  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),

  setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),

  openModal: (content: React.ReactNode) =>
    set({
      isModalOpen: true,
      modalContent: content,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      modalContent: null,
    }),

  addNotification: (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newNotification = { ...notification, id };

    set(state => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove after duration
    const duration = notification.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }
  },

  removeNotification: (id: string) =>
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    })),
}));
