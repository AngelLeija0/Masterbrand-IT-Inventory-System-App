import { defineStore } from "pinia";

export const useViewStore = defineStore('viewStore', {
  state: () => ({
    data: null,
  }),
  getters: {
    getView(state) {
      return state.data
    }
  },
  actions: {
    setView(data) {
      this.data = data;
    },
    clearView() {
      this.data = null;
    },
  },
});
