<template>
  <q-title class="text-h5 text-weight-medium">
    {{ label }}
  </q-title>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageTitle",
  props: {
    label: {
      type: String,
    },
  },
});
</script>
