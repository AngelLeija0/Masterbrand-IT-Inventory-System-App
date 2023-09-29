<template>
  <q-dialog v-model="dialogState" persistent>
    <q-card class="q-pa-md" style="width: 700px; max-width: 80vw; max-height: 80vh;">
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
        <div class="q-pa-md bg-grey-12 rounded-borders">
          <div class="q-pb-xs">Selecciona una cateogoria para comenzar</div>
          <q-select
          clearable
          dense
          v-model="inputInfo.category"
          :options="categories"
          label="Categoria"
          class="q-mb-md"
          />
        </div>
        <div class="q-pa-md" v-if="inputInfo.category === 'Computadora' || inputInfo.category === 'Laptop'">
          <q-file
          dense
          v-model="inputInfo.images"
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
          v-model="inputInfo.description"
          label="Descripción"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="inputInfo.manufacturer"
          label="Fabricante"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="inputInfo.model"
          label="Modelo"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="inputInfo.serial_number"
          label="Serial"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="inputInfo.operating_system"
          label="S/O"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="inputInfo.ram"
          label="RAM"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="inputInfo.cost"
          label="Costo"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="inputInfo.purchase_from"
          label="Lugar de compra"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="inputInfo.purchase_date"
          label="Fecha de compra"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="inputInfo.warranty_info"
          label="Costo"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="inputInfo.warranty_expiration_date"
          label="Vencimiento de garantia"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="inputInfo.location"
          label="Ubicación"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="inputInfo.location_extra_info"
          label="Ubicacion (información extra)"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
          <q-input
          clearable
          dense
          v-model="inputInfo.current_employee"
          label="Empleado"
          class="q-mb-md"
          hint="requerido"
          :rules="[val => !!val || 'requerido']"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right" v-if="inputCategory">
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
      "Computadora", "Laptop", "Celular", "Impresora", "Consumibles"
    ])

    const inputInfo = ref({})

    return {
      dialogState,
      categories,
      inputInfo,
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
