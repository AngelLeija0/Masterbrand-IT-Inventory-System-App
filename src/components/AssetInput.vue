<template>
  <div class="flex justify-between items-center q-py-sm" style="border-bottom: 1px solid rgb(239, 239, 239);">
    <div class="q-pr-md text-grey-14" style="width: 30%;">{{ label }}</div>
    <q-input v-model="localValue" dense borderless :readonly="!isEditing" @change="updateValue" input-style="font-weight: 500;" />
    <q-btn icon="edit" flat round size="12px" :color="isEditing ? 'primary' : 'black'" @click="toggleEditing" />
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "AssetInput",
  props: {
    label: {
      type: String,
    },
    modelValue: {
      type: String,
    },
    modelKey: {
      type: String,
    },
    editing: {
      type: Boolean,
    },
  },
  setup(props) {
    const localValue = ref(props.modelValue)
    const keyValue = ref(props.modelKey)
    const isEditing = ref(props.editing)

    watch(() => props.modelValue, (newValue) => {
      localValue.value = newValue
    })

    watch(() => props.modelKey, (newValue) => {
      keyValue.value = newValue
    })

    watch(() => props.editing, (newEditingValue) => {
      isEditing.value = newEditingValue
    })

    return {
      localValue,
      keyValue,
      isEditing,
    }
  },
  methods: {
    toggleEditing () {
      this.$emit("update-editing", this.isEditing)
    },
    updateValue() {
      this.$emit("update-input", this.keyValue, this.localValue);
    },
  }
});
</script>
