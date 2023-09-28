<template>
  <div class="row">
    <div class="col-md-6 col-12 q-px-sm">
      <div class="row">
        <div class="col-md-12 col-12 flex justify-center text-center q-pb-sm items-start">
          <q-img class="q-pa-md q-mx-sm" :src="inputInfo.images?.default_image" spinner-color="white"
            style="height: 140px; max-width: 150px" />
          <q-btn icon="edit" flat round size="12px" :color="isEditingImage ? 'primary' : 'black'"
            @click="isEditingImage = true" />
        </div>
        <div class="col-md-12 col-12">
          <AssetInput label="Categoria" modelKey="category" :modelValue="inputInfo.category" :editing="isEditing"
            @update-input="updateInputInfo" @update-editing="updateEditing" />
          <AssetInput label="Descripción" modelKey="description" :modelValue="inputInfo.description" :editing="isEditing"
            @update-input="updateInputInfo" @update-editing="updateEditing" />
          <AssetInput label="Fabricante" modelKey="manufacturer" :modelValue="inputInfo.manufacturer" :editing="isEditing"
            @update-input="updateInputInfo" @update-editing="updateEditing" />
          <AssetInput label="Modelo" modelKey="model" :modelValue="inputInfo.model" :editing="isEditing"
            @update-input="updateInputInfo" @update-editing="updateEditing" />
          <AssetInput label="Serial" modelKey="serial_number" :modelValue="inputInfo.serial_number" :editing="isEditing"
            @update-input="updateInputInfo" @update-editing="updateEditing" />
          <AssetInput label="S/O" modelKey="operating_system" :modelValue="inputInfo.operating_system"
            :editing="isEditing" @update-input="updateInputInfo" @update-editing="updateEditing" />
          <AssetInput label="RAM" modelKey="ram" :modelValue="inputInfo.ram" :editing="isEditing"
            @update-input="updateInputInfo" @update-editing="updateEditing" />
        </div>
      </div>
    </div>
    <div class="col-md-6 col-12 q-px-sm">
      <AssetInput label="Costo" modelKey="cost" :modelValue="inputInfo.cost" :editing="isEditing"
        @update-input="updateInputInfo" @update-editing="updateEditing" />
      <AssetInput label="Lugar de compra" modelKey="purchase_from" :modelValue="inputInfo.purchase_from"
        :editing="isEditing" @update-input="updateInputInfo" @update-editing="updateEditing" />
      <AssetInput label="Fecha de compra" modelKey="purchase_date" :modelValue="inputInfo.purchase_date"
        :editing="isEditing" @update-input="updateInputInfo" @update-editing="updateEditing" />
      <AssetInput label="Garantia" modelKey="warranty_info" :modelValue="inputInfo.warranty_info" :editing="isEditing"
        @update-input="updateInputInfo" @update-editing="updateEditing" />
      <AssetInput label="Vencimiento de garantia" modelKey="warranty_expiration_date"
        :modelValue="inputInfo.warranty_expiration_date" :editing="isEditing" @update-input="updateInputInfo"
        @update-editing="updateEditing" />
      <AssetInput label="Ubicación" modelKey="location" :modelValue="inputInfo.location" :editing="isEditing"
        @update-input="updateInputInfo" @update-editing="updateEditing" />
      <AssetInput label="Ubicacion (información extra)" modelKey="location_extra_info"
        :modelValue="inputInfo.location_extra_info" :editing="isEditing" @update-input="updateInputInfo"
        @update-editing="updateEditing" />
      <AssetInput label="Empleado" modelKey="current_employee" :modelValue="inputInfo.current_employee"
        :editing="isEditing" @update-input="updateInputInfo" @update-editing="updateEditing" />
      <div v-if="isEditing" class="flex justify-end q-pt-lg">
        <q-btn-group flat>
          <q-btn class="q-ma-xs" label="Guardar" color="primary" icon-right="save" size="0.85rem"
            style="text-transform: capitalize;" />
          <q-btn class="q-ma-xs" label="Cancelar" flat @click="isEditing = false" size="0.85rem"
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
      <q-card-section class="flex justify-between items-center" style="max-height: 400px; overflow-y: auto;">
        <div v-for="(image, i) in inputInfo.images?.all" :key="i" v-ripple style="cursor: pointer; position: relative;"
          @mouseenter="highlightedImageIndex = i" @mouseleave="highlightedImageIndex = -1"
          @click="setNewDefaultImge(image)">
          <q-img class="q-pa-md q-ma-sm" :src="image" spinner-color="white" style="height: 120px; width: 140px" />
          <div v-if="highlightedImageIndex === i" class="image-circle-hover"></div>
        </div>
      </q-card-section>

      <q-card-actions>
        <q-file v-model="inputNewImage" label="Subir nueva imagen" outlined rounded dense clearable accept=".jpg, image/*"
          class="q-mx-md" style="text-transform: none; width: 225px; font-size: 12px; height: fit-content;">
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
        <q-btn label="Guardar" color="primary" outline rounded icon-right="save" size="0.85rem" padding="sm md"
          style="text-transform: capitalize;" />
        <q-btn label="Cancelar" color="black" flat rounded size="0.85rem" padding="sm md" v-close-popup
          style="text-transform: capitalize;" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { api } from "src/boot/axios"
import { useRoute } from 'vue-router'

import AssetInput from 'src/components/AssetInput.vue'

export default defineComponent({
  name: "TechnologyDetails",
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
    const router = useRoute()

    const inputInfo = ref(props.modelInfo)

    const isEditing = ref(false)
    const isEditingImage = ref(false)

    const inputNewImage = ref()

    console.log(inputInfo.value)

    return {
      router,
      inputInfo,
      isEditing,
      isEditingImage,
      inputNewImage,
    }
  },
  methods: {
    updateInputInfo(key, newValue) {
      this.inputInfo[key] = newValue
    },
    updateEditing(value) {
      this.isEditing = !value
    },
    saveAssetDetails() {
      console.log(this.inputInfo)
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
            }
          })
          .catch((err) => {
            console.log(err)
          });
      } catch (error) {
        console.log(error)
      }
    },
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






