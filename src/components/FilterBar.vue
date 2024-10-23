<template>
  <div class="bg-grey-2 q-pa-sm">
    <div v-if="isMobile">
      <div class="flex justify-between">
        <q-input v-model="inputSearchBar" dense outlined label="Buscador" style="width: 70%;"
          @keyup="getDataBySearchBar()">
          <template v-slot:append>
            <q-icon name="search" color="black" />
          </template>
        </q-input>
        <q-btn size="13px" icon="menu" flat hide-dropdown-icon>
          <q-menu class="justify-center q-py-sm">
            <q-list v-if="actualRoute === 'assets-page'">
              <q-btn-dropdown flat size="0.8rem" label="Buscar por QR" icon="qr_code_scanner" class="q-ma-xs full-width"
                style="text-transform: none; align-items: start;" @click="dialogScanQR = true" />
            </q-list>
            <q-list>
              <q-btn-dropdown label="Filtrar" size="0.8rem" :text-color="isFiltering ? 'primary' : ''"
                :icon="isFiltering ? 'filter_alt' : 'filter_list'" flat class="q-ma-xs full-width"
                content-style="height: 400px;" style="text-transform: none; align-items: start;">
                <div class="row no-wrap q-pa-md">
                  <div class="column">
                    <div class="text-h6 q-mb-md">Filtros</div>
                    <q-input v-model="filterInput" class="q-pb-md" dense borderless label="Buscar filtros">
                      <template v-slot:append>
                        <q-icon name="search" color="black" />
                      </template>
                    </q-input>
                    <div v-for="(checkbox, i) in filterDictionary[actualRoute]" :key="i + 1" class="column">
                      <q-checkbox v-model="checkbox.boxModel" size="xs" :label="checkbox.label" checked-icon="add"
                        unchecked-icon="horizontal_rule" indeterminate-icon="horizontal_rule"
                        :color="checkbox.boxModel ? 'primary' : 'black'" @click="
                          checkbox.boxModel === true
                            ? (checkbox.boxModel = true)
                            : (checkbox.boxModel = false),
                          updateFiltering()
                          " />
                      <div v-if="checkbox.boxModel" class="q-pl-sm q-pb-md">
                        <q-select v-model="checkbox.inputModel" :options="defineFilterOptions(checkbox.key)" dense
                          outlined clearable class="q-px-md" input-style="font-weight: 500;"
                          @update:modelValue="() => updateFiltering(i, checkbox.key)" />
                      </div>
                    </div>
                  </div>
                </div>
              </q-btn-dropdown>
            </q-list>
            <q-list v-if="actualRoute === 'assets-page'">
              <q-btn-dropdown label="Vista" size="0.8rem" icon="tune" flat class="q-ma-xs full-width"
                style="text-transform: none; align-items: start;">
                <div class="row no-wrap q-pa-md">
                  <div class="column">
                    <div class="text-h6 q-mb-md">Vista</div>
                    <div class="flex">
                      <div class="full-width q-pb-sm">Detalles</div>
                      <q-checkbox v-model="viewDictionary.details" @click="updateView('details')" size="xs" />
                      <q-icon name="density_small" size="50px" />
                    </div>
                    <div class="flex q-pt-md">
                      <div class="full-width">Contenido</div>
                      <q-checkbox v-model="viewDictionary.content" @click="updateView('content')" size="xs" />
                      <q-icon name="view_list" size="50px" />
                    </div>
                  </div>
                </div>
              </q-btn-dropdown>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>
    <div v-else class="row">
      <div class="col-12 col-sm-6 col-md-6 flex">
        <q-input v-model="inputSearchBar" dense outlined label="Buscador" style="width: 70%;"
          @keyup="getDataBySearchBar()">
          <template v-slot:append>
            <q-icon name="search" color="black" />
          </template>
        </q-input>
        <q-btn v-if="actualRoute === 'assets-page'" class="q-mx-sm" flat size="14px" icon="qr_code_scanner"
          @click="dialogScanQR = true">
          <q-tooltip class="bg-black" style="font-size: 0.75rem;">Buscar por QR</q-tooltip>
        </q-btn>
      </div>
      <div class="col-12 col-sm-6 col-md-6 flex justify-end">
        <q-btn-group flat>
          <q-btn-dropdown size="14px" label="Filtros" :text-color="isFiltering ? 'primary' : ''"
            :icon="isFiltering ? 'filter_alt' : 'filter_list'" flat rounded style="text-transform: capitalize"
            content-style="height: 400px;">
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md">Filtros</div>
                <q-input v-model="filterInput" class="q-pb-md" dense borderless label="Buscar filtros" @update:model-value="updateFilters">
                  <template v-slot:append>
                    <q-icon name="search" color="black" />
                  </template>
                </q-input>
                <div v-for="(checkbox, i) in filterDictionary[actualRoute]" :key="i + 1" class="column">
                  <q-checkbox v-model="checkbox.boxModel" size="xs" :label="checkbox.label" checked-icon="add"
                    unchecked-icon="horizontal_rule" indeterminate-icon="horizontal_rule"
                    :color="checkbox.boxModel ? 'primary' : 'black'" @click="
                      checkbox.boxModel === true
                        ? (checkbox.boxModel = true)
                        : (checkbox.boxModel = false),
                      updateFiltering()
                      " />
                  <div v-if="checkbox.boxModel" class="q-pl-sm q-pb-md">
                    <q-select v-model="checkbox.inputModel" :options="defineFilterOptions(checkbox.key)" dense outlined
                      clearable class="q-px-md" input-style="font-weight: 500;"
                      @update:modelValue="() => updateFiltering(i, checkbox.key)" />
                  </div>
                </div>
              </div>
            </div>
          </q-btn-dropdown>
          <q-btn-dropdown v-if="actualRoute === 'assets-page'" size="14px" label="Vista" icon="tune"
            :color="isViewActive ? 'primary' : 'black'" flat rounded style="text-transform: capitalize">
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md">Vista</div>
                <div class="flex">
                  <div class="full-width q-pb-sm">Detalles</div>
                  <q-checkbox v-model="viewDictionary.details" @click="updateView('details')" size="xs" />
                  <q-icon name="density_small" size="50px" />
                </div>
                <div class="flex q-pt-md">
                  <div class="full-width">Contenido</div>
                  <q-checkbox v-model="viewDictionary.content" @click="updateView('content')" size="xs" />
                  <q-icon name="view_list" size="50px" />
                </div>
              </div>
            </div>
          </q-btn-dropdown>
        </q-btn-group>
      </div>
    </div>

    <q-dialog v-model="dialogScanQR" persistent transparent>
      <q-card class="q-pa-md" style="width: 600px; max-width: 85vw; max-height: 70vh; overflow: hidden;">
        <q-card-actions align="right" class="q-py-none">
          <q-btn icon="close" color="black" flat round @click="dialogScanQR = false, camReady = false"
            class="q-py-none" />
        </q-card-actions>
        <q-card-section class="q-pt-none q-pb-sm">
          <div class="text-h5 text-weight-medium">Buscar por codigo QR</div>
          <div class="text-subtitle2 text-weight-regular">Escanea el codigo QR para encontrar la informacion un producto.
          </div>
        </q-card-section>
        <q-card-section style="position: relative;">
          <div v-if="labelErrorQR" class="q-pa-lg flex justify-center items-center text-center">
            <q-icon class="q-ma-md" name="error" size="64px" color="red"></q-icon>
            <div class="full-width color-red text-h6" style="font-weight: 500;">Error</div>
            <div class="full-width">{{ labelErrorQR }}</div>
          </div>
          <div v-if="!camReady" class="flex justify-center items-center q-ma-md">
            <div class="q-px-md">Buscando camara</div>
            <q-spinner-dots color="primary" size="2em" />
          </div>
          <QrcodeStream @camera-on="camReady = true" @detect="onDecode" @error="onError" class="qr-video" />
          <div v-if="Object.keys(assetFounded).length > 0"
            style="position: absolute; background: white; bottom: 48px; border-radius: 0 10px 10px 0;">
            <q-btn :label="assetFounded.label" icon-right="navigate_next" size="14px" flat
              style="text-transform: capitalize; font-weight: normal;" @click="redirectToAsset(assetFounded.id)">
              <q-tooltip class="bg-black" style="font-size: 0.75rem;">Ver mas informacion</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import { useDataApiStore } from "src/stores/data-api-store";
import { useViewStore } from "src/stores/view-store"
import { api } from "src/boot/axios"

import { QrcodeStream } from "vue-qrcode-reader";

export default defineComponent({
  name: "FilterBar",
  components: {
    QrcodeStream
  },
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

    const $q = useQuasar();

    const router = useRoute();
    const actualRoute = ref(router.name);

    const dataApiStore = useDataApiStore();
    const dataApi = ref(null)

    const isFiltering = ref(false);

    const filterDictionary = ref({
      'assets-page': [
        {
          label: "Categoria",
          key: "category",
          inputModel: "",
          inputOptions: "",
          boxModel: false,
          isActive: false,
        },
        {
          label: "Fabricante",
          key: "manufacturer",
          inputModel: "",
          inputOptions: "",
          boxModel: false,
          isActive: false,
        },
        {
          label: "Modelo",
          key: "model",
          inputModel: "",
          inputOptions: "",
          boxModel: false,
          isActive: false,
        },
        {
          label: "Ubicacion",
          key: "location",
          inputModel: "",
          inputOptions: "",
          boxModel: false,
          isActive: false,
        },
        {
          label: "Estado",
          key: "status",
          inputModel: "",
          inputOptions: "",
          boxModel: false,
          isActive: false,
        },
      ],
      'categories-page': [
        {
          label: "Nombre",
          key: "name",
          inputModel: "",
          inputOptions: "",
          boxModel: false,
          isActive: false,
        },
        {
          label: "Propiedades",
          key: "properties",
          inputModel: "",
          inputOptions: "",
          boxModel: false,
          isActive: false,
        },
      ],
    });

    const inputSearchBar = ref(null)

    const viewStore = useViewStore()
    const viewDictionary = ref()
    const isViewActive = ref(false)

    if (viewStore.getView) {
      viewDictionary.value = { ...viewStore.getView }
    } else {
      viewDictionary.value = {
        details: true,
        content: false,
      }
    }

    const dialogScanQR = ref(false)
    const dialogQrResult = ref(false)
    const labelErrorQR = ref("")
    const assetFounded = ref({})
    const camReady = ref(false)

    const filterInput = ref()
    const filterAux = ref(filterDictionary.value[actualRoute.value])

    return {
      isMobile,
      router,
      actualRoute,
      isFiltering,
      filterDictionary,
      inputSearchBar,
      dataApiStore,
      dataApi,
      viewStore,
      viewDictionary,
      isViewActive,
      dialogScanQR,
      dialogQrResult,
      labelErrorQR,
      assetFounded,
      camReady,
      filterInput,
      filterAux,
    };
  },
  methods: {
    updateFilters() {
        if (!this.filterInput) return this.filterDictionary[this.actualRoute] = this.filterAux
        this.filterDictionary[this.actualRoute] = this.filterDictionary[this.actualRoute].filter((filter) => {
          if (this.filterInput.length == 1 && filter.label.toLowerCase().startsWith(this.filterInput.toLowerCase())) {
            return filter
          }
          const regex = new RegExp(this.filterInput.toLowerCase(), 'i')
          return filter.label.toLowerCase().match(regex)
        });
    },
    updateView(view) {
      Object.keys(this.viewDictionary).map((key) => {
        if (view !== key) {
          this.viewDictionary[key] = false
        } else {
          this.viewDictionary[key] = true
        }
      })
      this.viewStore.setView(this.viewDictionary)
      this.$emit("updateView")
    },
    defineFilterOptions(filter) {
      if (this.dataApi != null) {
        const allData = this.dataApi
        const options = allData.map((data) => data[filter])

        if (filter === "properties") {
          const depuredOptions = options.flatMap((value) => {
            return value.flatMap((value2) => {
              return Object.keys(value2).map((key) => {
                if (key === "name") {
                  return value2[key]
                }
              }).filter((element) => element !== undefined)
            })
          })

          const preDepuredAllOptions = [...new Set(depuredOptions)]
          const depuredAllOptions = preDepuredAllOptions.filter(element => element !== undefined)
          return depuredAllOptions
        }
        const preDepuredAllOptions = [...new Set(options)]
        const depuredAllOptions = preDepuredAllOptions.filter(element => element !== undefined)
        return depuredAllOptions
      }
      this.dataApi = this.dataApiStore.getDataApi
      this.defineFilterOptions(filter)
    },
    updateFiltering(filterDictionaryKey = null, filterKey = null) {
      const filters = this.filterDictionary[this.actualRoute]
      this.isFiltering = filters.some((filter) => filter.inputModel)

      if (filterDictionaryKey != null && filterKey != null) {
        if (filterKey === "properties") {
          return this.updatePropertiesFilters(filterDictionaryKey)
        }
        const filteredData = this.dataApi.filter((data) => data[filterKey] === filters[filterDictionaryKey].inputModel)
        if (filteredData.length > 0) {
          this.dataApiStore.setDataApi(filteredData)
          return this.$emit("reloadData")
        }
        this.dataApiStore.setDataApi(this.dataApi)
        return this.$emit("reloadData")
      }
    },
    updatePropertiesFilters(filterDictionaryKey) {
      const filters = this.filterDictionary[this.actualRoute]
      const selectedProperty = filters[filterDictionaryKey].inputModel

      if (!selectedProperty) {
        this.dataApiStore.setDataApi(this.dataApi)
        return this.$emit("reloadData")
      }

      const filteredData = this.dataApi.filter((data) => {
        return data.properties.some((property) => {
          return property.name === selectedProperty;
        });
      });
      if (filteredData.length > 0) {
        this.dataApiStore.setDataApi(filteredData);
        this.$emit("reloadData");
      } else {
        this.dataApiStore.setDataApi(this.dataApi)
        return this.$emit("reloadData")
      }
    },
    getDataBySearchBar() {
      if (this.dataApi != null) {
        if (this.inputSearchBar == null || this.inputSearchBar == "") {
          this.dataApiStore.setDataApi(this.dataApi)
          return this.$emit("reloadData")
        }
        const resultsFilter = this.dataApi.filter((data) => {
          return Object.values(data).some((value) => {
            return String(value).includes(this.inputSearchBar);
          });
        });
        this.dataApiStore.setDataApi(resultsFilter);
        this.$emit("reloadData");
      } else {
        this.dataApi = this.dataApiStore.getDataApi
        this.getDataBySearchBar()
      }
    },
    redirectToAsset(idAsset) {
      this.$router.push({ path: `./inventario/${idAsset}` })
    },
    onDecode(data) {
      const qr = data[0]
      const qrData = qr.rawValue
      this.assetFounded = null
      api
        .get(`./assets/${qrData}`)
        .then((res) => {
          const data = res.data
          if (data) {
            this.assetFounded = {
              id: qrData,
              label: data.description
            }
            this.$q.notify({
              type: "positive",
              message: "Producto encontrado.",
              timeout: 2000,
            })
          }
          else {
            this.$q.notify({
              type: "negative",
              message: "No se encontro informacion del producto.",
              timeout: 2000,
            })
          }
        })
        .catch((err) => {
          this.$q.notify({
            type: "negative",
            message: "No se encontro el producto.",
            timeout: 2000,
          })
        })
    }
  },
  onError(error) {
    console.log(error)
    if (error.name === 'NotAllowedError') {
      return this.labelErrorQR = 'Necesitas aceptar los permisos para acceder a la camara'
    }
    if (error.name === 'NotFoundError') {
      return this.labelErrorQR = 'No se encontro una camara en este dispositivo'
    }
    if (error.name === 'NotSupportedError') {
      return this.labelErrorQR = 'Contexto seguro requerido (HTTPS, localhost)'
    }
    if (error.name === 'NotReadableError') {
      return this.labelErrorQR = 'La camara ya esta en uso'
    }
    if (error.name === 'OverconstrainedError') {
      return this.labelErrorQR = 'La camara no es adecuada'
    }
    if (error.name === 'StreamApiNotSupportedError') {
      return this.labelErrorQR = 'La funcion no esta disponible en tu navegador'
    }
    if (error.name === 'InsecureContextError') {
      return this.labelErrorQR = 'El acceso a la camara solo esta permetido en un contexto seguro (HTTPS, localhost)'
    }
    return this.labelErrorQR = "Ha ocurrido un error."
  }
});
</script>

<style>
.qr-video video {
  border-radius: 10px;
}
</style>
