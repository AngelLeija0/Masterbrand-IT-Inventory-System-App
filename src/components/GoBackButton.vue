<template>
  <q-btn
  flat
  dense
  padding="sm sm sm xs"
  label="Regresar"
  size="0.75rem"
  icon="chevron_left"
  style="border-radius: 10px; text-transform: capitalize;"
  @click="goBack"
  />
</template>

<script>
import { defineComponent } from "vue";
import { useRoute } from 'vue-router'

export default defineComponent({
  name: "PrimaryButton",
  setup () {
    const router = useRoute()

    return {
      router
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
});
</script>
