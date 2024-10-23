import { boot } from 'quasar/wrappers'
import axios from 'axios'

const serverURL = "http://localhost:3000" // http://10.10.181.57:8081 - ISS API

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
