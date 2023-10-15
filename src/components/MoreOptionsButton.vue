<template>
  <q-btn outline size="0.75rem" icon-right="more_vert" flat style="border-radius: 10px; text-transform: capitalize;">
    <q-tooltip class="bg-black" style="font-size: 0.75rem;">Mas opciones</q-tooltip>
    <q-menu class="justify-center q-py-sm">
      <q-list v-for="(option, i) in options" :key="i + 1" style="width: 200px;">
        <q-btn flat size="0.8rem" :label="option.label" :icon="option.icon" :color="option.color" align="left" class="q-ma-xs q-px-md q-py-sm full-width"
          style="text-transform: none;" @click="handleOptionClick(option.value)" v-close-popup />
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MoreOptionsButton",
  props: {
    options: {
      type: Array,
    },
  },
  methods: {
    handleOptionClick(option) {
      this.$emit("optionClicked", option)
    }
  },
});
</script>
