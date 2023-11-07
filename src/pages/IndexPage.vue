<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="https://s201.q4cdn.com/943623151/files/images/mb-logo.png"
      style="width: 300px"
    >
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useUserStore } from "../stores/user-store"
import { useRouter } from "vue-router"

export default defineComponent({
  name: 'IndexPage',
  setup(props, { emit }) {
    const userStore = useUserStore()
    const router = useRouter()

    console.log(userStore.getUser)

    verifyLogin()

    function verifyLogin() {
      if (userStore.getUser === null) {
        router.push({ name: 'login-page' })
        emit("updateRoute", 'false')
      } else {
        emit("updateRoute", 'true')
      }
    }

    return {
      userStore,
      router,
    }
  }
})
</script>
