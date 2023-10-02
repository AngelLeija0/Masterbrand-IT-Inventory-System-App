<template>
  <div class="bg-grey-2 flex justify-between q-pa-sm">
    <div class="flex">
      <q-input v-model="inputSearchBar" dense outlined label="Buscador" style="width: 25vw;"
        @keyup="getDataBySearchBar()">
        <template v-slot:append>
          <q-icon name="search" color="black" />
        </template>
      </q-input>
      <q-btn class="q-mx-sm" flat size="14px" icon="qr_code_scanner" />
    </div>
    <q-btn-group flat>
      <q-btn-dropdown size="14px" label="Filtros" :text-color="isFiltering ? 'primary' : ''"
        :icon="isFiltering ? 'filter_alt' : 'filter_list'" flat rounded style="text-transform: capitalize;"
        content-style="height: 400px;">
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md">Filtros</div>
            <q-input class="q-pb-md" dense borderless label="Buscar filtros">
              <template v-slot:append>
                <q-icon name="search" color="black" />
              </template>
            </q-input>
            <div v-if="actualRoute === 'assets-page'" class="column">
              <div class="q-pb-xs">Caracteristicas</div>
              <q-checkbox v-model="checkboxFilter" @click="updateFiltering" size="xs" label="Categoria" />
              <q-checkbox v-model="checkboxFilter" size="xs" label="Descripcion" />
              <q-checkbox v-model="checkboxFilter" size="xs" label="Fabricante" />
              <q-checkbox v-model="checkboxFilter" size="xs" label="Modelo" />
              <q-checkbox v-model="checkboxFilter" size="xs" label="Numero serial" />
              <q-checkbox v-model="checkboxFilter" size="xs" label="Lugar de compra" />
              <q-checkbox v-model="checkboxFilter" size="xs" label="Fecha de compra" />
              <q-checkbox v-model="checkboxFilter" size="xs" label="Costo" />
              <q-checkbox v-model="checkboxFilter" size="xs" label="IP address" />
              <q-checkbox v-model="checkboxFilter" size="xs" label="Ubicacion" />

              <div class="q-pt-md q-pb-xs">Estado</div>
              <q-checkbox v-model="checkboxFilter" size="xs" label="Activo" />
              <q-checkbox v-model="checkboxFilter" size="xs" label="Inactivo" />
              <q-checkbox v-model="checkboxFilter" size="xs" label="Roto" />
            </div>
            <div v-if="actualRoute === 'categories-page'" class="column">
              <q-checkbox v-model="checkboxFilter.name" @click="updateFiltering" size="xs" label="Nombre" checked-icon="add"
                unchecked-icon="horizontal_rule" indeterminate-icon="horizontal_rule" :color="checkboxFilter.name ? 'primary' : 'black'" />
              <div v-if="checkboxFilter.name" class="q-pl-sm q-pb-md">
                <q-input dense outlined class="q-px-md" input-style="font-weight: 500;"/>
              </div>
              <q-checkbox v-model="checkboxFilter.properties" @click="updateFiltering" size="xs" label="Propiedades" checked-icon="add"
                unchecked-icon="horizontal_rule" indeterminate-icon="horizontal_rule" :color="checkboxFilter.properties ? 'primary' : 'black'" />
            </div>
          </div>
        </div>
      </q-btn-dropdown>
      <q-btn-dropdown size="14px" label="Vista" icon="tune" flat rounded style="text-transform: capitalize">
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md">Vista</div>
            <div class="flex">
              <div class="full-width q-pb-sm">Detalles</div>
              <q-checkbox v-model="checkBoxViewDetails" size="xs" />
              <q-icon name="density_small" size="50px" />
            </div>
            <div class="flex q-pt-md">
              <div class="full-width">Contenido</div>
              <q-checkbox v-model="checkBoxViewContent" size="xs" />
              <q-icon name="view_list" size="50px" />
            </div>
          </div>
        </div>
      </q-btn-dropdown>
    </q-btn-group>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue"
import { useRoute } from 'vue-router'
import { useDataApiStore } from "src/stores/data-api-store"

export default defineComponent({
  name: "FilterBar",
  setup() {
    const route = useRoute()
    const actualRoute = ref(route.name)

    const isFiltering = ref(false)

    const checkboxFilter = ref({})

    const inputSearchBar = ref(null)

    const dataApiStore = useDataApiStore()
    const dataApi = dataApiStore.getDataApi

    return {
      route,
      actualRoute,
      isFiltering,
      checkboxFilter,
      inputSearchBar,
      dataApiStore,
      dataApi,
    }
  },
  methods: {
    updateFiltering() {
      console.log(this.checkboxFilter)
      if (this.checkboxFilter || this.checkboxFilter == {}) {
        this.isFiltering = true
      } else {
        this.isFiltering = false
      }
    },
    getDataBySearchBar() {
      if (this.inputSearchBar == null || this.inputSearchBar == '') {
        return this.$emit("getAllData")
      }
      const resultsFilter = this.dataApiStore.getDataApi.filter((data) => {
        return Object.values(data).some((value) => {
          return String(value).includes(this.inputSearchBar)
        });
      });
      this.dataApiStore.setDataApi(resultsFilter)
      this.$emit("realodData")
    }

  }
});
</script>
