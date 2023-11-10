<template>
  <q-dialog v-model="dialogState" persistent>
    <q-card class="q-pa-md" style="width: 80vw; max-width: 80vw; min-height: 70vh; overflow-y: auto;">
      <q-card-actions align="right" class="q-py-none">
        <q-btn icon="close" color="black" flat round v-close-popup @click="closeDialog" class="q-py-none" />
      </q-card-actions>
      <q-card-section class="q-pt-none q-pb-md" style="border-bottom: 1px solid #e9e9e9">
        <div class="text-h6">Consulta existencias</div>
      </q-card-section>
      <q-card-section>
        <q-stepper v-model="findStockStep" header-nav ref="stepper" color="primary" animated flat
          :vertical="isMobile ? true : false">
          <q-step :name="1" title="Selecciona el tipo de busqueda" icon="settings" :done="findStockStep > 1"
            :header-nav="findStockStep > 1">
            <div>Selecciona una opcion para continuar.</div>
            <div class="flex justify-between q-pt-md">
              <q-card class="flex q-pa-md q-pb-xl" style="width: 45%;">
                <q-checkbox v-model="findStockCheckbox.inventory"
                  @update:model-value="updateFindStockCheckboxs('inventory')" style="border-radius: 30px;" />
                <div class="flex justify-center full-width text-center">
                  <q-card-title class="full-width" style="font-size: 1.0rem;">Productos</q-card-title>
                  <q-icon name="inventory" size="42px" class="q-pt-sm"></q-icon>
                </div>
              </q-card>
              <q-card class="flex q-pa-md q-pb-xl" style="width: 45%;">
                <q-checkbox v-model="findStockCheckbox.category"
                  @update:model-value="updateFindStockCheckboxs('category')" />
                <div class="flex justify-center full-width text-center">
                  <q-card-title class="full-width" style="font-size: 1.0rem;">Categorias</q-card-title>
                  <q-icon name="bookmark" size="42px" class="q-pt-sm"></q-icon>
                </div>
              </q-card>
            </div>
            <q-stepper-navigation>
              <q-btn @click="() => { done1 = true; findStockStep = 2; findStockCheckbox.inventory ? getAllProducts() : '' }"
                :disable="!(findStockCheckbox.inventory == true) && !(findStockCheckbox.category == true)" color="primary"
                label="Continuar" class="q-px-lg" style="text-transform: none;" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="2" title="Especificar busqueda" icon="search" :done="findStockStep > 2"
            :header-nav="findStockStep > 2">
            <div v-if="findStockCheckbox.inventory == true">
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
            <q-stepper-navigation :style="{ paddingTop: isMobile ? '20px' : '158px' }">
              <q-btn @click="() => { done2 = true; findStockStep = 3 }" color="primary" label="Continuar" class="q-px-lg"
                :disable="!assetToFind" style="text-transform: none;" />
              <q-btn flat @click="findStockStep = 1" color="dark" label="Regresar" class="q-ml-sm q-px-lg"
                style="text-transform: none;" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="3" title="Resultado de busqueda" icon="description" :header-nav="findStockStep > 3">
            Try out different ad text to see what brings in the most customers, and learn how to
            enhance your ads using features like ad extensions. If you run into any problems with
            your ads, find out how to tell if they're running and how to resolve approval issues.

            <q-stepper-navigation>
              <q-btn color="primary" @click="done3 = true" label="Finish" />
              <q-btn flat @click="findStockStep = 2" color="primary" label="Back" class="q-ml-sm" />
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
  name: "DialogFindStock",
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
    const findStockStep = ref(1)
    const findStockCheckbox = ref({
      inventory: false,
      category: false,
    })

    const mainAssetOptions = ref()
    const assetOptions = ref()
    const assetToFind = ref()

    function getAllProducts() {
      api
        .get("./reports/all-products")
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

    return {
      isMobile,
      dialogState,
      findStockStep,
      findStockCheckbox,
      mainAssetOptions,
      assetOptions,
      assetToFind,
      getAllProducts,
    }
  },
  methods: {
    openDialog() {
      this.dialogState = true
    },
    closeDialog() {
      this.dialogState = false
      this.findStockStep = 1
      this.findStockCheckbox = {
        inventory: false,
        category: false,
      }
      this.mainAssetOptions = null
      this.assetToFind = null
    },
    updateFindStockCheckboxs(checkboxActive) {
      if (checkboxActive === 'inventory') {
        this.findStockCheckbox.category = false
      }
      if (checkboxActive === 'category') {
        this.findStockCheckbox.inventory = false
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
  },
});
</script>

<style scoped>
.q-checkbox__bg {
  border-radius: 15px !important;
}
</style>
