<template>
  <div class="flex justify-between items-center q-py-sm"
    style="border-bottom: 1px solid rgb(239, 239, 239); width: 100%;">
    <div class="q-pr-md text-grey-14" style="width: 30%;">{{ label }}</div>
    <q-select v-model="localValue" :options="options" dense borderless :readonly="!isEditing || label === 'Categoría'"
      @update:model-value="updateValue" hide-dropdown-icon input-style="font-weight: 500;" class="span-selected-option"
      style="width: 50%;" />
    <q-btn icon="edit" flat round size="12px" :color="isEditing ? 'primary' : 'black'" @click="toggleEditing"
      :disabled="label === 'Categoría'">
      <q-tooltip class="bg-black" style="font-size: 0.75rem;" v-if="label === 'Categoría'">No es posible editar la
        categoria</q-tooltip>
      <q-tooltip class="bg-black" style="font-size: 0.75rem;" v-else-if="!isEditing">Editar</q-tooltip>
      <q-tooltip class="bg-black" style="font-size: 0.75rem;" v-else>Cerrar editor</q-tooltip>
    </q-btn>
  </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from "vue";

export default defineComponent({
  name: "AssetSelecInput",
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
    options: {
      type: Array,
    },
    editing: {
      type: Boolean,
    },
  },
  setup(props) {
    const localValue = ref(props.modelValue)
    const keyValue = ref(props.modelKey)
    const isEditing = ref(props.editing)

    const initialValue = ref(null)

    watch(() => props.modelValue, (newValue) => {
      localValue.value = newValue
      if (!initialValue.value) {
        initialValue.value = newValue
      }
    })

    watch(() => props.modelKey, (newValue) => {
      keyValue.value = newValue
    })

    watch(() => props.editing, (newEditingValue) => {
      isEditing.value = newEditingValue
      if (!newEditingValue) {
        localValue.value = initialValue.value
      }
    })

    onMounted(() => {
      initialValue.value = props.modelValue;
    });

    return {
      localValue,
      initialValue,
      keyValue,
      isEditing,
    }
  },
  methods: {
    toggleEditing() {
      this.$emit("update-editing", this.isEditing)
    },
    updateValue() {
      this.$emit("update-input", this.keyValue, this.localValue)
    },
  }
});
</script>

<style>
.span-selected-option span {
  font-weight: 500 !important;
}
</style>
