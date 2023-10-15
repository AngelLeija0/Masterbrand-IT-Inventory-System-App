<template>
  <div class="row">
    <div class="col-md-6 col-12 q-px-sm">
      <div class="row">
        <div class="col-md-12 col-12 flex justify-center text-center q-pb-sm items-start">
          <q-img class="q-pa-md q-mx-sm" :src="imageServer + '/uploads/images/' + inputInfo.images?.default_image"
            spinner-color="white" style="height: 140px; max-width: 150px" />
          <q-btn icon="edit" flat round size="12px" :color="isEditingImage ? 'primary' : 'black'"
            @click="isEditingImage = true" />
        </div>
        <div class="col-md-12 col-12" v-for="(property, i) in Object.keys(inputInfo)" :key="i + 1">
          <div v-if="filterProperty(property) && i <= ((Object.keys(inputInfo).length / 2))">
            <div v-if="property === 'status'">
              <AssetInput label="Estado" :modelKey="property" :modelValue="inputInfo.status.name" :editing="isEditing"
                @update-input="updateInputInfo" @update-editing="updateEditing" />
            </div>
            <div v-else-if="property === 'created_at' || property === 'updated_at'">
              <div class="flex justify-between items-center q-py-sm"
                style="border-bottom: 1px solid rgb(239, 239, 239); width: 100%;">
                <div class="q-pr-md text-grey-14" style="width: 30%;">{{ defineLabelFromProperty(property) }}</div>
                <q-input v-model="inputInfo[property]" dense borderless readonly input-style="font-weight: 500;" />
              </div>
            </div>
            <div v-else>
              <AssetInput :label="defineLabelFromProperty(property)" :modelKey="property"
                :modelValue="inputInfo[property]" :editing="isEditing" @update-input="updateInputInfo"
                @update-editing="updateEditing" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 col-12 q-px-sm">
      <div v-for="(property, i) in Object.keys(inputInfo)" :key="i + 1">
        <div v-if="filterProperty(property) && i > ((Object.keys(inputInfo).length / 2))">
          <div v-if="property === 'status'">
            <AssetInput label="Estado" :modelKey="property" :modelValue="inputInfo.status.name" :editing="isEditing"
              @update-input="updateInputInfo" @update-editing="updateEditing" />
          </div>
          <div v-else-if="property === 'created_at' || property === 'updated_at'">
            <div class="flex justify-between items-center q-py-sm"
              style="border-bottom: 1px solid rgb(239, 239, 239); width: 100%;">
              <div class="q-pr-md text-grey-14" style="width: 30%;">{{ defineLabelFromProperty(property) }}</div>
              <q-input v-model="inputInfo[property]" dense borderless readonly input-style="font-weight: 500;" />
            </div>
          </div>
          <div v-else>
            <AssetInput :label="defineLabelFromProperty(property)" :modelKey="property" :modelValue="inputInfo[property]"
              :editing="isEditing" @update-input="updateInputInfo" @update-editing="updateEditing" />
          </div>
        </div>
      </div>
      <div v-if="isEditing" class="flex justify-end q-pt-lg">
        <q-btn-group flat>
          <q-btn class="q-ma-xs" label="Guardar" color="primary" icon-right="save" size="0.85rem"
            style="text-transform: capitalize;" @click="saveAsset()" />
          <q-btn class="q-ma-xs" label="Cancelar" flat @click="cancelEdit()" size="0.85rem"
            style="text-transform: capitalize;" />
        </q-btn-group>
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

export default defineComponent({
  name: "AssetInfo",
  props: {
    modelInfo: {
      type: Object,
    },
  },
  components: {
    AssetInput,
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

    return {
      router,
      originalInputInfo,
      inputInfo,
      isEditing,
      isEditingImage,
      inputNewImage,
      imageServer,
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
    filterProperty(property) {
      if (property !== '_id' && property !== 'images' && property !== '__v' && property !== 'actions') {
        return true
      }
      return false
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
        created_at: "Creado el",
        updated_at: "Actualizado el",
      }
      return translationDictionary[property] || property;
    },
    editAsset() {

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






