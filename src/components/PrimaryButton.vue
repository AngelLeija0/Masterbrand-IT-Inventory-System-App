<template>
  <q-btn :label="label" outline size="0.75rem" :icon-right="icon"
    style="border-radius: 10px; text-transform: capitalize;">
    <q-tooltip class="bg-black" v-if="toolTip">{{ toolTip }}</q-tooltip>
  </q-btn>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PrimaryButton",
  props: {
    label: {
      type: String,
    },
    icon: {
      type: String,
    },
    toolTip: {
      type: String,
    }
  },
});
</script>
