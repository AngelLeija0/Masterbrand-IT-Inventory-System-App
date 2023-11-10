<template>
  <div class="flex justify-between items-center q-py-sm"
    style="border-bottom: 1px solid rgb(239, 239, 239); width: 100%;">
    <div class="q-pr-md text-grey-14" :style="{ width: isMobile ? '100%' : '30%' }">{{ label }}</div>
    <q-input v-model="localValue" dense borderless :readonly="!isEditing || label === 'Categoría'"
      :rules="inputRulesDictionary[keyValue]" @change="updateValue" hide-bottom-space input-style="font-weight: 500;"
      :style="{ width: isMobile ? '70%' : '50%' }" />
    <q-btn icon="edit" flat round size="12px" :color="isEditing ? 'primary' : 'grey-14'" @click="toggleEditing"
      :disabled="label === 'Categoría'">
      <q-tooltip class="bg-black" style="font-size: 0.75rem;" v-if="label === 'Categoría'">No es posible editar la
        categoria</q-tooltip>
      <q-tooltip class="bg-black" style="font-size: 0.75rem;" v-else-if="!isEditing">Editar</q-tooltip>
      <q-tooltip class="bg-black" style="font-size: 0.75rem;" v-else>Cerrar editor</q-tooltip>
    </q-btn>
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

    const isMobile = ref(isUsingMobile());

    function isUsingMobile() {
      const validation1 = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const validation2 = window.innerWidth < 768
      const finalValidation = validation1 || validation2;
      return finalValidation;
    }

    window.addEventListener("resize", () => {
      isMobile.value = isUsingMobile()
    })

    const localValue = ref(props.modelValue)
    const keyValue = ref(props.modelKey)
    const isEditing = ref(props.editing)

    const inputRulesDictionary = ref({
      name: [
        val => !!val,
        val => val.length < 30,
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val)
      ],
      description: [
        val => !!val,
        val => val.length < 80,
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val)
      ],
      "status.description": [
        val => !!val,
        val => val.length < 50,
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val)
      ],
      "status.date": [
        val => !!val,
        val => val.length < 20,
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val)
      ],
      manufacturer: [
        val => !!val,
        val => val.length < 30,
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val)
      ],
      model: [
        val => !!val,
        val => val.length < 30,
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val)
      ],
      serial_number: [
        val => !!val,
        val => val.length < 20,
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val)
      ],
      purchase_from: [
        val => !!val,
        val => val.length < 30,
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val)
      ],
      purchase_date: [
        val => !!val,
        val => val.length < 20,
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val)
      ],
      cost: [
        val => !!val,
        val => val.length < 20,
        val => !/[!@#$%^&*()_+={}|:\;'<>?~`]/gi.test(val)
      ],
      warranty_info: [
        val => !!val,
        val => val.length < 30,
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val)
      ],
      warranty_expiration_date: [
        val => !!val,
        val => val.length < 20,
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val)
      ],
      current_employee: [
        val => !!val,
        val => val.length < 50,
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val)
      ],
      operating_system: [
        val => !!val,
        val => val.length < 20,
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val)
      ],
      ram: [
        val => !!val,
        val => val.length > 20,
        val => !/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(val)
      ],
    });

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
      isMobile,
      localValue,
      keyValue,
      isEditing,
      inputRulesDictionary,
    }
  },
  methods: {
    toggleEditing() {
      this.$emit("update-editing", this.isEditing)
    },
    updateValue() {
      this.$emit("update-input", this.keyValue, this.localValue);
    },
  }
});
</script>
