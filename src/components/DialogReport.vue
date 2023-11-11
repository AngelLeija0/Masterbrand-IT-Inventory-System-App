<template>
  <q-dialog v-model="dialogState" persistent>
    <q-card class="q-pa-md" style="width: 80vw; max-width: 80vw; max-heightht: 90vh; overflow-y: auto;">
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
                <q-checkbox v-model="reportCheckbox.inventory" @update:model-value="updateReportCheckboxs('inventory')"
                  style="border-radius: 30px;" />
                <div class="flex justify-center full-width text-center">
                  <q-card-title class="full-width" style="font-size: 1.0rem;">Productos</q-card-title>
                  <q-icon name="inventory" size="42px" class="q-pt-sm"></q-icon>
                </div>
              </q-card>
              <q-card class="flex q-pa-md q-pb-xl" style="width: 45%;">
                <q-checkbox v-model="reportCheckbox.category" @update:model-value="updateReportCheckboxs('category')" />
                <div class="flex justify-center full-width text-center">
                  <q-card-title class="full-width" style="font-size: 1.0rem;">Categorias</q-card-title>
                  <q-icon name="bookmark" size="42px" class="q-pt-sm"></q-icon>
                </div>
              </q-card>
            </div>
            <q-stepper-navigation :style="{ paddingTop: isMobile ? '20px' : '60px' }">
              <q-btn
                @click="() => { done1 = true; reportStep = 2; reportCheckbox.inventory ? getReportOptions('assets') : reportCheckbox.category ? getReportOptions('categories') : '' }"
                :disable="!(reportCheckbox.inventory == true) && !(reportCheckbox.category == true)" color="primary"
                label="Continuar" class="q-px-lg" style="text-transform: none;" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="2" title="Especificar busqueda" icon="search" :done="reportStep > 2" :header-nav="reportStep > 2"
            style="padding-bottom: 0;">
            <div class="q-pb-md">Haz elegido la busqueda por <span style="font-weight: 500;">{{ reportCheckbox.inventory ?
              'Producto' : reportCheckbox.category ? 'Categoria' : '' }}</span>.
              Selecciona un producto en especifico para buscar su stock.
            </div>
            <q-select filled v-model="inputSpecificSearch" use-input dense input-debounce="0"
              :options="specificSearchOptions" clearable @filter="filterAssetOptions" class="full-width"
              style="width: 250px">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-stepper-navigation :style="{ paddingTop: isMobile ? '20px' : '80px' }">
              <q-btn @click="() => { done2 = true; reportStep = 3; getResults() }" color="primary" label="Continuar"
                class="q-px-lg" :disable="!inputSpecificSearch" style="text-transform: none;" />
              <q-btn flat @click="() => { reportStep = 1; inputSpecificSearch = null }" color="dark" label="Regresar"
                class="q-ml-sm q-px-lg" style="text-transform: none;" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="3" title="Resultado de busqueda" icon="description" :header-nav="reportStep > 3">
            <div class="text-h6 q-pb-sm">{{ inputSpecificSearch }}</div>
            <div v-if="assetReportResults.length > 0" class="flex justify-start">
              <div v-for="(asset, i) in assetReportResults" :key="i + 1"
                class="flex justify-between items-center q-py-md q-mr-lg"
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
            <q-stepper-navigation :style="{ paddingTop: isMobile ? '20px' : '80px' }">
              <q-btn color="primary" @click="() => { done3 = true, closeDialog() }" label="Terminar" class="q-px-lg"
                style="text-transform: none;" :disable="assetReportResults.length == 0" />
              <q-btn flat @click="() => { reportStep = 2; assetReportResults = [] }" color="dark" label="Regresar"
                class="q-ml-sm q-px-lg" style="text-transform: none;" />
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
    const specificSearchOptions = ref()
    const inputSpecificSearch = ref()

    const assetReportResults = ref([])

    return {
      isMobile,
      dialogState,
      reportStep,
      reportCheckbox,
      mainAssetOptions,
      specificSearchOptions,
      inputSpecificSearch,
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
      this.inputSpecificSearch = null
      this.assetReportResults = []
    },
    getReportOptions(type) {
      api
        .get(`./reports/all-${type}`)
        .then((res) => {
          const data = res.data
          if (data.length > 0) {
            this.mainAssetOptions = data
            this.specificSearchOptions = data
          }
        })
        .catch((err) => {
          console.log(err)
        })
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
          this.specificSearchOptions = this.mainAssetOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase();
        this.specificSearchOptions = this.mainAssetOptions.filter((v) =>
          v.toLowerCase().includes(needle)
        )
      })
    },
    getResults() {
      const type = this.reportCheckbox.inventory ? 'asset' : this.reportCheckbox.category ? 'category' : ''
      api
        .get(`./reports/${type}/${this.inputSpecificSearch}`)
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

