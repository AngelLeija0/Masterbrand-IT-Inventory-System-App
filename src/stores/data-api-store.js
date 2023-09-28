import { defineStore } from "pinia";

export const useDataApiStore = defineStore('dataApiStore', {
  state: () => ({
    data: null,
  }),
  getters: {
    getDataApi(state) {
      return state.data
    }
  },
  actions: {
    setDataApi(data) {
      this.data = data;
    },
    clearDataApi() {
      this.data = null;
    },
  },
});
