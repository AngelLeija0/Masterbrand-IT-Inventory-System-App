<template>
  <q-btn
    :label="label"
    size="0.9rem"
    align="left"
    flat
    padding="sm md"
    :color="active ? 'dark' : 'grey-8'"
    :style="{
      borderTop: borderPosition === 'top' && active == true ? '5px solid #1565c0' : '5px solid #f5f5f5',
      borderBottom: borderPosition === 'bottom' && active == true ? '5px solid #1565c0' : '5px solid #f5f5f5',
      borderRight: borderPosition === 'right' && active == true ? '5px solid #1565c0' : '5px solid #f5f5f5',
      borderLeft: borderPosition === 'left' && active == true ? '5px solid #1565c0' : '5px solid #f5f5f5',
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
    },
    borderPosition: {
      type: String,
    }
  },
});
</script>
