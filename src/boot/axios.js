import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Local: http://localhost:3000
// Render: https://api-masterbrand-it-inventory-system.onrender.com

const serverURL = "https://api-masterbrand-it-inventory-system.onrender.com"

const api = axios.create({ baseURL: serverURL })

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api, serverURL }
