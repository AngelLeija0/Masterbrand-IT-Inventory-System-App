<template>
  <PrimaryButton label="Cerrar sesion" icon="logout" size="0.7rem" style="border-radius: 7px; text-transform: none;" />
</template>

<script>
import { capitalize, defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'

import PrimaryButton from './PrimaryButton.vue'

export default defineComponent({
  name: 'LogoutButton',
  props: {
    label: {
      String,
    },
  },
  components: {
    PrimaryButton,
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
    }
  },
})
</script>
