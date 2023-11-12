import { defineStore } from "pinia";

export const useNotificationStore = defineStore('notificationStore', {
  state: () => ({
    data: null,
  }),
  getters: {
    getNotification(state) {
      return state.data
    }
  },
  actions: {
    setNotification(data) {
      this.data = data;
    },
    clearNotification() {
      this.data = null;
    },
  },
});
