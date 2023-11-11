<template>
  <q-dialog v-model="dialogState" persistent>
    <q-card class="q-pa-md" style="width: 80vw; max-width: 80vw; min-height: 70vh; overflow-y: auto;">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="black" flat round v-close-popup @click="closeDialog" class="q-py-none" />
      </q-card-actions>
      <q-card-section class="q-pt-none q-pb-md" style="border-bottom: 1px solid #e9e9e9">
        <div class="text-h6">Consulta existencias</div>
      </q-card-section>
      <q-card-section style="padding-bottom: 0;">
        <q-stepper v-model="reportStep" header-nav ref="stepper" color="primary" animated flat
          :vertical="isMobile ? true : false">

          <q-step :name="1" title="Selecciona el tipo de busqueda" icon="settings" :done="reportStep > 1"
            :header-nav="reportStep > 1">
            <div>Selecciona una opcion para continuar.</div>
            <div class="flex justify-between q-pt-md">
              <q-card class="flex q-pa-md q-pb-xl" style="width: 45%;">
                <q-checkbox v-model="reportCheckbox.inventory"
                  @update:model-value="updateReportCheckboxs('inventory')" style="border-radius: 30px;" />
                <div class="flex justify-center full-width text-center">
                  <q-card-title class="full-width" style="font-size: 1.0rem;">Productos</q-card-title>
                  <q-icon name="inventory" size="42px" class="q-pt-sm"></q-icon>
                </div>
              </q-card>
              <q-card class="flex q-pa-md q-pb-xl" style="width: 45%;">
                <q-checkbox v-model="reportCheckbox.category"
                  @update:model-value="updateReportCheckboxs('category')" />
                <div class="flex justify-center full-width text-center">
                  <q-card-title class="full-width" style="font-size: 1.0rem;">Categorias</q-card-title>
                  <q-icon name="bookmark" size="42px" class="q-pt-sm"></q-icon>
                </div>
              </q-card>
            </div>
            <q-stepper-navigation :style="{ paddingTop: isMobile ? '20px' : '60px' }">
              <q-btn
                @click="() => { done1 = true; reportStep = 2; reportCheckbox.inventory ? getAllProducts() : '' }"
                :disable="!(reportCheckbox.inventory == true) && !(reportCheckbox.category == true)" color="primary"
                label="Continuar" class="q-px-lg" style="text-transform: none;" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="2" title="Especificar busqueda" icon="search" :done="reportStep > 2"
            :header-nav="reportStep > 2" style="padding-bottom: 0;">
            <div v-if="reportCheckbox.inventory == true">
              <div class="q-pb-md">Haz elegido la busqueda por <span style="font-weight: 500;">Producto</span>.
                Selecciona un producto en especifico para buscar su stock.
              </div>
              <q-select filled v-model="assetToFind" use-input dense input-debounce="0" :options="assetOptions" clearable
                @filter="filterAssetOptions" class="full-width" style="width: 250px">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

            </div>
            <q-stepper-navigation :style="{ paddingTop: isMobile ? '20px' : '195px' }">
              <q-btn @click="() => { done2 = true; reportStep = 3, getAssetStock() }" color="primary" label="Continuar" class="q-px-lg"
                :disable="!assetToFind" style="text-transform: none;" />
              <q-btn flat @click="reportStep = 1" color="dark" label="Regresar" class="q-ml-sm q-px-lg"
                style="text-transform: none;" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="3" title="Resultado de busqueda" icon="description" :header-nav="reportStep > 3" style="max-height: 356px; overflow-y: auto;">
            <div class="text-h6 q-pb-sm">{{ assetToFind }}</div>
            <div v-if="assetReportResults.length > 0" class="flex justify-between">
              <div v-for="(asset, i) in assetReportResults" :key="i + 1" class="flex justify-between items-center q-py-md q-my-sm"
                :style="{ width: isMobile ? '100%' : '30%', marginTop: isMobile ? '10px' : '', borderBottom: '1px solid rgb(239, 239, 239)' }">
                <div class="text-grey-14" style="font-weight: 500;">{{ asset.label }}</div>
                <div style="font-weight: 500;">{{ asset.quantity }}</div>
              </div>
            </div>
            <div v-else class="flex justify-center items-center q-pt-md">
              <div class="full-width text-center">
                Cargando resultados
              </div>
              <q-spinner-dots color="primary" size="24px" />
            </div>
            <q-stepper-navigation :style="{ paddingTop: isMobile ? '20px' : assetReportResults.length > 2 ? '52px' : '178px' }">
              <q-btn color="primary" @click="() => { done3 = true, closeDialog() }" label="Terminar" class="q-px-lg" style="text-transform: none;"
                :disable="assetReportResults.length == 0" />
              <q-btn flat @click="reportStep = 2" color="primary" label="Regresar" class="q-ml-sm q-px-lg"
                style="text-transform: none;" />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>

      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { stringify } from "postcss"
import { defineComponent, ref } from "vue"
import { api } from "src/boot/axios"

export default defineComponent({
  name: "DialogReport",
  setup() {
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

    const dialogState = ref(false)
    const reportStep = ref(1)
    const reportCheckbox = ref({
      inventory: false,
      category: false,
    })

    const mainAssetOptions = ref()
    const assetOptions = ref()
    const assetToFind = ref()

    function getAllProducts() {
      api
        .get("./reports/all-assets")
        .then((res) => {
          const data = res.data
          if (data.length > 0) {
            mainAssetOptions.value = data
            assetOptions.value = data
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }

    const assetReportResults = ref([])

    return {
      isMobile,
      dialogState,
      reportStep,
      reportCheckbox,
      mainAssetOptions,
      assetOptions,
      assetToFind,
      getAllProducts,
      assetReportResults,
    }
  },
  methods: {
    openDialog() {
      this.dialogState = true
    },
    closeDialog() {
      this.dialogState = false
      this.reportStep = 1
      this.reportCheckbox = {
        inventory: false,
        category: false,
      }
      this.mainAssetOptions = null
      this.assetToFind = null
    },
    updateReportCheckboxs(checkboxActive) {
      if (checkboxActive === 'inventory') {
        this.reportCheckbox.category = false
      }
      if (checkboxActive === 'category') {
        this.reportCheckbox.inventory = false
      }
    },
    filterAssetOptions(val, update) {
      if (val === '') {
        update(() => {
          this.assetOptions = this.mainAssetOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase();
        this.assetOptions = this.mainAssetOptions.filter((v) =>
          v.toLowerCase().includes(needle)
        )
      })
    },
    getAssetStock() {
      console.log(this.assetToFind)
      api
        .get(`./reports/asset/${this.assetToFind}`)
        .then((res) => {
          const data = res.data
          if (data.length > 0) {
            this.assetReportResults = data
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
});
</script>

