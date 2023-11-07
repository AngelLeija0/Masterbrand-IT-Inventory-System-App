<template>
  <q-btn-dropdown :label="label" dropdown-icon="person" :class="'q-mx-xs q-px-lg ' + (isMobile ? 'full-width' : '')" size="0.9rem" flat
    style="text-transform: capitalize; border-radius: 7px 7px 2px 2px;" @click="logout()">
    <div class="row no-wrap q-pa-md">
      <div class="column">
        <div class="text-h6 q-mb-md">Settings</div>
        <q-toggle v-model="mobileData" label="Use Mobile Data" />
        <q-toggle v-model="bluetooth" label="Bluetooth" />
      </div>

      <q-separator vertical inset class="q-mx-lg" />

      <div class="column items-center">
        <q-avatar size="72px">
          <img src="https://cdn.quasar.dev/img/boy-avatar.png">
        </q-avatar>

        <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

        <q-btn color="primary" label="Logout" push size="sm" v-close-popup />
      </div>
    </div>
  </q-btn-dropdown>
</template>

<script>
import { capitalize, defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'LogoutButton',
  props: {
    label: {
      String,
    },
  },
  setup() {
    const isMobile = ref(isUsingMobile())

    function isUsingMobile() {
      const validation1 =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      const validation2 = window.innerWidth < 768
      const finalValidation = validation1 || validation2
      return finalValidation
    }

    window.addEventListener('resize', () => {
      isMobile.value = isUsingMobile()
    })

    const router = useRoute()

    return {
      router,
      isMobile
    }
  },
  methods: {
    logout() {
      console.log("Saliendo ...")
    }
  },
})
</script>
