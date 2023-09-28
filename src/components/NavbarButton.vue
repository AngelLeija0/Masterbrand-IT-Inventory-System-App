<template>
  <q-btn
    :label="label"
    class="q-mx-xs q-px-lg"
    size="0.9rem"
    :style="{
      borderBottom: active ? '3px solid #1565c0' : '',
      textTransform: 'capitalize'
    }"
    @click="redirectToPage(toPage)"
  />
</template>

<script>
import { capitalize, defineComponent } from "vue";
import { useRoute } from 'vue-router'

export default defineComponent({
  name: "NavbarButton",
  setup() {
    const route = useRoute()

    return {
      route
    }
  },
  computed: {
    active() {
      return this.route.name === this.toPage || (this.route.name === 'asset-details-page' && this.toPage === 'assets-page');
    }
  },
  methods: {
    redirectToPage(page) {
      this.$router.push({ name: page })
    }
  },
  props: {
    label: {
      type: String,
    },
    toPage: {
      type: String,
    },
  },
});
</script>
