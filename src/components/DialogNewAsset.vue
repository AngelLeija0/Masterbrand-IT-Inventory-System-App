<template>
  <q-dialog v-model="dialogState" persistent>
    <q-card class="q-pa-md" style="width: 700px; max-width: 80vw; max-height: 80vh;">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="black" flat round @click="closeDialog" class="q-py-none" />
      </q-card-actions>
      <q-card-section class="q-pt-none q-pb-sm">
        <div class="text-h5 text-weight-medium">Nuevo Producto</div>
      </q-card-section>
      <q-card-section>
        <div class="q-mb-lg">
          <q-title class="text-subtitle2 text-weight-regular">Completa los siguientes campos. En caso de que no aplique
            puede dejar el campo
            en blanco.</q-title>
        </div>
        <div class="q-pa-md bg-grey-12 rounded-borders">
          <div class="q-pb-xs">Selecciona una categoria para comenzar</div>
          <q-select clearable dense v-model="inputInfo.category" :options="categoriesOptions" label="Categoria"
            class="q-mb-md" />
        </div>
        <div class="q-pa-md" v-if="inputInfo.category">
          <q-file dense v-model="inputInfo.images" label="Imagenes" use-chips multiple class="q-mb-md"
            accept=".jpg, image/*" hint="opcional" />
          <div v-for="(property, i) in propertiesOptions"
            :key="i">
            <q-input clearable dense v-model="inputInfo[property.key]" :label="property.name" class="q-mb-md"
              hint="requerido" :rules="[val => !!val || 'requerido']" />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Agregar" size="0.85rem" color="primary" dense outline padding="sm lg" @click="addAsset"
          style="border-radius: 10px; text-transform: capitalize;" />
        <q-btn label="Cancelar" size="0.85rem" flat dense outline @click="closeDialog" padding="sm lg"
          style="border-radius: 10px; text-transform: capitalize;" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, watch } from "vue"
import { useQuasar } from 'quasar'
import { api } from "src/boot/axios"

export default defineComponent({
  name: "DialogNewAsset",
  setup() {
    const $q = useQuasar()
    const dialogState = ref(false)

    const inputInfo = ref({})
    const categoriesInfo = ref([])
    const categoriesOptions = ref([])
    const propertiesOptions = ref([])

    watch(() => inputInfo.value.category, (newValue) => {
      if (newValue != null && newValue != undefined && newValue != {}){
        const category = categoriesInfo.value.filter((category) => category.name === newValue)
        propertiesOptions.value = category[0]?.properties
      }
    })

    function getAllCategories() {
      try {
        api
          .get("./categories")
          .then((res) => {
            const data = res.data
            if (data.length > 0) {
              categoriesInfo.value = data
              categoriesOptions.value = data.map((category) => {
                return category.name
              })
            }
          })
          .catch((err) => {
            console.log(err)
          });
      } catch (error) {
        console.log(error)
      }
    }

    return {
      dialogState,
      categoriesOptions,
      propertiesOptions,
      inputInfo,
      getAllCategories,
    }
  },
  methods: {
    openDialog() {
      this.dialogState = true
      this.getAllCategories()
    },
    closeDialog() {
      this.inputInfo = {}
      this.dialogState = false
    },
    addAsset() {
      console.log(this.inputInfo)
      
    }
  },
});
</script>
