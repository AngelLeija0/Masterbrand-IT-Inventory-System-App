<template>
  <q-btn :label="label" :icon="icon" :class="'q-mx-xs q-px-lg ' + (isMobile ? 'full-width' : '')" align="left" size="0.9rem" flat :style="{
    borderBottom: !isMobile && active ? '3px solid #1565c0' : '',
    color: isMobile && active ? '#1565c0' : '',
    textTransform: 'capitalize',
  }" @click="redirectToPage(toPage)" />
</template>

<script>
import { capitalize, defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'NavbarButton',
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

    const route = useRoute()

    return {
      route,
      isMobile
    }
  },
  computed: {
    active() {
      return (
        this.route.name === this.toPage ||
        (this.route.name === 'asset-details-page' &&
          this.toPage === 'assets-page')
      )
    }
  },
  methods: {
    redirectToPage(page) {
      this.$router.push({ name: page })
    }
  },
  props: {
    label: {
      type: String
    },
    icon: {
      type: String
    },
    toPage: {
      type: String
    }
  }
})
</script>
