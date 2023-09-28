<template>
  <q-dialog v-model="dialogState" persistent>
    <q-card class="q-pa-md" style="width: 700px; max-width: 80vw; height: 80vh; max-height: 80vh;">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="negative" flat round @click="closeDialog" class="q-py-none" />
      </q-card-actions>
      <q-card-section class="q-pt-none q-pb-sm">
        <div class="text-h6">Nuevo producto</div>
      </q-card-section>
      <q-card-section>
        <div class="q-mb-lg">
          <q-title class="text-subtitle2 text-weight-regular">Completa los siguientes campos. En caso de que no aplique
            puede dejar el campo
            en blanco.</q-title>
        </div>
        <div>
          <q-select
          clearable
          dense
          v-model="inputCategory"
          :options="categories"
          label="Categoria"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-file
          dense
          v-model="inputImages"
          label="Imagenes"
          use-chips
          multiple
          class="q-mb-md"
          accept=".jpg, image/*"
          hint="opcional"
          />
          <q-input
          clearable
          dense
          v-model="text"
          label="Descripcion"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <!-- De aqui en adelante falta -->
          <q-input
          clearable
          dense
          v-model="text"
          label="Descripcion"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="text"
          label="Descripcion"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="text"
          label="Descripcion"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="text"
          label="Descripcion"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="text"
          label="Descripcion"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="text"
          label="Descripcion"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="text"
          label="Descripcion"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="text"
          label="Descripcion"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="text"
          label="Descripcion"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="text"
          label="Descripcion"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="text"
          label="Descripcion"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="text"
          label="Descripcion"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="text"
          label="Descripcion"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="text"
          label="Descripcion"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="text"
          label="Descripcion"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="text"
          label="Descripcion"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Agregar" size="0.95rem" color="primary" dense padding="xs md" style="text-transform: capitalize;" />
        <q-btn label="Cancelar" size="0.95rem" flat dense @click="closeDialog" padding="xs md" style="text-transform: capitalize;" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "DialogNewAsset",
  props: {
    dState: {
      type: Boolean,
    },
  },
  setup() {
    const dialogState = ref(false)
    const categories = ref([
      "Computer", "Laptop", "Celulares", "Impresoras"
    ])

    const inputCategory = ref()
    const inputImages = ref()

    return {
      dialogState,
      categories,
      inputCategory,
      inputImages,
    }
  },
  methods: {
    openDialog() {
      this.dialogState = true
    },
    closeDialog() {
      this.dialogState = false
    },
  },
});
</script>
