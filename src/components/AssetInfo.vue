<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-md-6 col-sm-6 col-12 flex justify-center text-center q-pa-md items-start">
          <q-img class="q-pa-md q-mx-sm" :src="imageServer + '/uploads/attachments/' + inputInfo.images?.default_image"
            spinner-color="white" style="max-width: 260px" />
          <q-btn icon="edit" flat round size="12px" :color="isEditingImage ? 'primary' : 'black'"
            @click="isEditingImage = true" />
        </div>
        <div class="col-md-6 col-sm-6 col-12 bg-grey-2 q-pa-md" style="border-radius: 10px;">
          <div class="text-h6">Estado</div>
          <div v-for="(stateProperty, i) in Object.keys(inputInfo.status)" :key="i + 1">
            <AssetSelectInput v-if="stateProperty === 'name'" label="Estado" :options="statusOptions"
              :modelKey="'status.name'" :modelValue="inputInfo.status.name" :editing="isEditing"
              @update-input="updateInputInfo" @update-editing="updateEditing" />
            <AssetInput v-else :label="defineLabelFromProperty(stateProperty)" :modelKey="'status.' + stateProperty"
              :modelValue="new RegExp('date').test(stateProperty) ? formatDate(inputInfo.status[stateProperty]) : inputInfo.status[stateProperty]"
              :editing="isEditing" @update-input="updateInputInfo" @update-editing="updateEditing" />
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 q-pt-sm">
      <div class="row flex justify-between">
        <div class="col-md-6 col-12 q-px-md" v-for="(property, i) in allProperties" :key="i + 1">
          <AssetInput :label="defineLabelFromProperty(property)" :modelKey="property"
            :modelValue="new RegExp('date').test(property) ? formatDate(inputInfo[property]) : inputInfo[property]"
            :editing="isEditing" @update-input="updateInputInfo" @update-editing="updateEditing" />
        </div>
        <div v-if="isEditing" class="col-12 flex q-px-md q-pt-lg" :style="{ justifyContent: isMobile ? 'center' : 'end' }">
          <q-btn-group flat>
            <q-btn class="q-ma-xs" label="Guardar" color="primary" icon-right="save" :size="isMobile ? '0.725rem' : '0.85rem'"
              style="text-transform: capitalize; border-radius: 5px;" @click="saveAsset()" />
            <q-btn class="q-ma-xs" label="Cancelar" flat @click="cancelEdit()" :size="isMobile ? '0.725rem' : '0.85rem'"
              style="text-transform: capitalize; border-radius: 5px;" />
          </q-btn-group>
        </div>
      </div>
    </div>
    <div class="col-12 q-px-md q-pt-md flex justify-end">
      <div class="full-width text-grey-14" :style="{ fontSize: isMobile ? '12px' : '14px', textAlign: isMobile ? 'start' : 'end' }">Creado el {{
        formatDate(inputInfo.created_at) }}</div>
      <div class="full-width text-grey-14"
        :style="{ fontSize: isMobile ? '12px' : '14px', textAlign: isMobile ? 'start' : 'end', paddingTop: isMobile ? '5px' : '' }">Ultima modificacion el {{
          formatDate(inputInfo.updated_at) }}</div>
    </div>
  </div>

  <q-dialog v-model="isEditingImage">
    <q-card class="q-pa-md" style="width: 550px">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="black" flat round class="q-py-none" v-close-popup />
      </q-card-actions>
      <q-card-section class="q-pt-none" style="border-bottom: 1px solid #e9e9e9">
        <div class="text-h6" style="padding-top: 0;">Imagenes</div>
      </q-card-section>
      <q-card-section class="q-py-md">
        Selecciona una imagen para asignarla como imagen principal.
      </q-card-section>
      <q-card-section class="flex justify-around items-around" style="max-height: 450px;">
        <div v-for="(image, i) in inputInfo.images?.all" :key="i" v-ripple style="cursor: pointer; position: relative;"
          @mouseenter="highlightedImageIndex = i" @mouseleave="highlightedImageIndex = -1"
          @click="setNewDefaultImge(image)">
          <q-img class="q-pa-md q-ma-sm" :src="imageServer + '/uploads/attachments/' + image" spinner-color="white"
            style="height: 120px; width: 140px" />
          <div v-if="highlightedImageIndex === i" class="image-circle-hover"></div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { api, serverURL } from "src/boot/axios"
import { useRoute } from 'vue-router'
import { date } from 'quasar'

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

    const allProperties = ref([])

    getCategorProperties()
    function getCategorProperties() {
      const category = inputInfo.value?.category
      api
        .get(`./categories/name/${category}`)
        .then((res) => {
          const data = res.data
          const keyProperties = data.properties.map((property) => property.key)
          joinPropertiesAndFilter(Object.keys(inputInfo.value), keyProperties)
        })
        .catch((err) => {
          console.log(err)
        });
    }

    function joinPropertiesAndFilter(infoProperties, categoryProperties) {
      const propertiesJoined = [...new Set([...infoProperties, ...categoryProperties])];
      const formattedArrayProperties = []
      propertiesJoined.map((property) => {
        if (property !== '_id' && property !== 'images' && property !== '__v' && property !== 'actions' && property !== 'created_at' &&
          property !== 'updated_at' && property !== 'status' && property !== 'status.name') {
          return formattedArrayProperties.push(property)
        }
      })
      allProperties.value = formattedArrayProperties
    }

    function formatDate(dateToFormat) {
      return date.formatDate(dateToFormat, 'DD/MMMM/YYYY - hh:mm', {
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      })
    }

    return {
      isMobile,
      router,
      originalInputInfo,
      inputInfo,
      isEditing,
      isEditingImage,
      inputNewImage,
      imageServer,
      statusOptions,
      allProperties,
      formatDate,
    }
  },
  methods: {
    updateInputInfo(key, newValue) {
      if (key === "status.name") {
        this.originalInputInfo.status.name = this.inputInfo.status.name
        this.inputInfo.status.name = newValue
      } else {
        this.inputInfo[key] = newValue
      }
    },
    updateEditing(value) {
      this.isEditing = !value
      this.inputInfo = { ...this.originalInputInfo }
      this.$emit("update-info")
    },
    saveAsset() {
      const asset = this.inputInfo
      api
        .patch(`./assets/update/${asset._id}`, asset)
        .then((res) => {
          const data = res.data
          if (data) {
            this.inputInfo = data
            this.originalInputInfo = { ...this.inputInfo }
            this.isEditing = false
            this.$emit("update-info")
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
      this.inputInfo = { ...this.originalInputInfo }
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






