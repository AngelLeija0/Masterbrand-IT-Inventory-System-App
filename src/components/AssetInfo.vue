<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-md-6 col-sm-6 col-12 flex justify-center text-center q-pb-sm items-start">
          <q-img class="q-pa-md q-mx-sm" :src="imageServer + '/uploads/images/' + inputInfo.images?.default_image"
            spinner-color="white" style="height: 140px; max-width: 150px" />
          <q-btn icon="edit" flat round size="12px" :color="isEditingImage ? 'primary' : 'black'"
            @click="isEditingImage = true" />
        </div>
        <div class="col-md-6 col-sm-6 col-12 bg-grey-2 q-pa-md" style="border-radius: 10px;">
          <div class="text-h6">Estado</div>
          <div v-for="(stateProperty, i) in Object.keys(inputInfo.status)" :key="i + 1">
            <AssetSelectInput :label="defineLabelFromProperty(stateProperty)" :options="statusOptions"
              :modelKey="stateProperty" :modelValue="inputInfo.status[stateProperty]" :editing="isEditing"
              @update-input="updateInputInfo" @update-editing="updateEditing" />
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 q-pt-sm">
      <div class="row flex justify-between">
        <div class="col-md-6 col-12 q-px-md" v-for="(property, i) in filterProperties(Object.keys(inputInfo))"
          :key="i + 1">
          <AssetInput :label="defineLabelFromProperty(property)" :modelKey="property" :modelValue="inputInfo[property]"
            :editing="isEditing" @update-input="updateInputInfo" @update-editing="updateEditing" />
        </div>
        <div v-if="isEditing" class="col-12 flex justify-end q-pt-lg q-px-md">
          <q-btn-group flat>
            <q-btn class="q-ma-xs" label="Guardar" color="primary" icon-right="save" size="0.85rem"
              style="text-transform: capitalize; border-radius: 5px;" @click="saveAsset()" />
            <q-btn class="q-ma-xs" label="Cancelar" flat @click="cancelEdit()" size="0.85rem"
              style="text-transform: capitalize; border-radius: 5px;" />
          </q-btn-group>
        </div>
      </div>
    </div>
  </div>

  <q-dialog v-model="isEditingImage">
    <q-card class="q-pa-md" style="width: 550px">
      <q-card-section>
        <div class="text-h6">Imagenes</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        Selecciona una imagen
      </q-card-section>
      <q-card-section class="flex justify-around items-around" style="max-height: 400px; overflow-y: auto;">
        <div v-for="(image, i) in inputInfo.images?.all" :key="i" v-ripple style="cursor: pointer; position: relative;"
          @mouseenter="highlightedImageIndex = i" @mouseleave="highlightedImageIndex = -1"
          @click="setNewDefaultImge(image)">
          <q-img class="q-pa-md q-ma-sm" :src="imageServer + '/uploads/images/' + image" spinner-color="white"
            style="height: 120px; width: 140px" />
          <div v-if="highlightedImageIndex === i" class="image-circle-hover"></div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-file v-model="inputNewImage" label="Subir nueva imagen" outlined rounded dense clearable accept=".jpg, image/*"
          class="q-mx-md" label-color="primary" color="primary"
          style="text-transform: none; font-size: 12px; height: fit-content;">
          <template v-slot:prepend>
            <q-icon name="cloud_upload" color="primary" />
          </template>
        </q-file>
        <q-btn label="Cancelar" color="black" flat rounded size="0.85rem" padding="sm md" v-close-popup
          style="text-transform: capitalize;" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { api, serverURL } from "src/boot/axios"
import { useRoute } from 'vue-router'

import AssetInput from 'src/components/AssetInput.vue'
import AssetSelectInput from './AssetSelectInput.vue'

export default defineComponent({
  name: "AssetInfo",
  props: {
    modelInfo: {
      type: Object,
    },
  },
  components: {
    AssetInput,
    AssetSelectInput,
  },
  data() {
    return {
      highlightedImageIndex: -1
    };
  },
  setup(props) {

    const imageServer = ref(serverURL)

    const router = useRoute()

    const inputInfo = ref(props.modelInfo)
    const originalInputInfo = ref({ ...inputInfo.value })

    const isEditing = ref(false)
    const isEditingImage = ref(false)

    const inputNewImage = ref()

    const statusOptions = ref([
      "Activo",
      "Inactivo",
      "Roto",
      "Con stock",
      "Bajo stock",
      "Sin stock",
    ]);

    return {
      router,
      originalInputInfo,
      inputInfo,
      isEditing,
      isEditingImage,
      inputNewImage,
      imageServer,
      statusOptions,
    }
  },
  methods: {
    updateInputInfo(key, newValue) {
      this.inputInfo[key] = newValue
    },
    updateEditing(value) {
      this.isEditing = !value
      this.inputInfo = { ...this.originalInputInfo };
    },
    saveAsset() {
      const asset = this.inputInfo
      console.log(this.inputInfo)
      api
        .patch(`./assets/update/${asset._id}`, asset)
        .then((res) => {
          const data = res.data
          if (data) {
            this.inputInfo = data
            this.originalInputInfo = { ...data };
            this.isEditing = false
            this.$q.notify({
              type: 'positive',
              message: 'Modificado correctamente.',
              timeout: 2000,
            })
          } else {
            this.$q.notify({
              type: 'negative',
              message: 'Ha ocurrido un error.',
              timeout: 2000,
            })
          }
        })
        .catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Ha ocurrido un error. ${err.message}`,
            timeout: 2000,
          })
        });
    },
    setNewDefaultImge(image) {
      this.inputInfo.images.default_image = image
      const asset = this.inputInfo
      console.log(asset)
      try {
        api
          .patch(`./assets/update/${asset._id}`, asset)
          .then((res) => {
            const data = res.data
            if (data) {
              this.inputInfo = data
              this.isEditingImage = false
              this.$q.notify({
                type: 'positive',
                message: 'Modificado correctamente.',
                timeout: 2000,
              })
            }
          })
          .catch((err) => {
            this.$q.notify({
              type: 'negative',
              message: `Ha ocurrido un error. ${err.message}`,
              timeout: 2000,
            })
          });
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: `Ha ocurrido un error. Error: ${error.message}`,
          timeout: 2000,
        })
      }
    },
    filterProperties(arrayProperties) {
      const formattedArrayProperties = []
      arrayProperties.map((property) => {
        if (property !== '_id' && property !== 'images' && property !== '__v' && property !== 'actions' && property !== 'created_at' && property !== 'updated_at' && property !== 'status') {
          return formattedArrayProperties.push(property)
        }
      })
      return formattedArrayProperties
    },
    defineLabelFromProperty(property) {
      const translationDictionary = {
        _id: "ID",
        category: "Categoría",
        images: "Imágenes",
        description: "Descripción",
        manufacturer: "Fabricante",
        model: "Modelo",
        serial_number: "Número de serie",
        purchase_from: "Lugar de compra",
        purchase_date: "Fecha de compra",
        cost: "Costo",
        warranty_info: "Información de garantía",
        warranty_expiration_date: "Fecha de vencimiento de la garantía",
        operating_system: "S/O",
        ip_address: "Dirección IP",
        ram: "RAM",
        location: "Ubicación",
        location_extra_info: "Información adicional de ubicación",
        current_employee: "Empleado actual",
        actions: "Acciones",
        status: "Estado",
        name: "Nombre",
        date: "Fecha",
        created_at: "Creado el",
        updated_at: "Actualizado el",
      }
      return translationDictionary[property] || property;
    },
    cancelEdit() {
      this.isEditing = false
      this.inputInfo = { ...this.originalInputInfo };
    }
  }
});
</script>

<style scoped>
.image-circle-hover {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #1976d243;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>






