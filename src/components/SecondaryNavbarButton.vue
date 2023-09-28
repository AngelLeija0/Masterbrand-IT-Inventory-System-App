<template>
  <q-btn
    :label="label"
    class="full-width"
    size="0.9rem"
    align="left"
    flat
    padding="sm md"
    :style="{
      borderLeft: active == true ? '5px solid #1565c0' : '5px solid #f5f5f5',
      textTransform: 'capitalize',
      fontWeight: 'normal'
    }"
  />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "SecondaryNavbarButton",
  props: {
    label: {
      type: String,
    },
    active: {
      type: String,
    }
  },
});
</script>
