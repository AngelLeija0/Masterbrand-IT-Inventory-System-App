import { defineStore } from "pinia";

export const useUserStore = defineStore('userStore', {
  state: () => ({
    data: null,
  }),
  getters: {
    getUser(state) {
      return state.data
    }
  },
  actions: {
    setUser(data) {
      this.data = data;
    },
    clearUser() {
      this.data = null;
    },
  },
})
