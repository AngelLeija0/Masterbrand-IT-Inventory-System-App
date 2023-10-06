<template>
  <div class="bg-grey-2 flex justify-between q-pa-sm">
    <div class="flex">
      <q-input v-model="inputSearchBar" dense outlined label="Buscador" style="width: 25vw" @keyup="getDataBySearchBar()">
        <template v-slot:append>
          <q-icon name="search" color="black" />
        </template>
      </q-input>
      <q-btn v-if="actualRoute === 'assets-page'" class="q-mx-sm" flat size="14px" icon="qr_code_scanner" />
    </div>
    <q-btn-group flat>
      <q-btn-dropdown size="14px" label="Filtros" :text-color="isFiltering ? 'primary' : ''"
        :icon="isFiltering ? 'filter_alt' : 'filter_list'" flat rounded style="text-transform: capitalize"
        content-style="height: 400px;">
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md">Filtros</div>
            <q-input class="q-pb-md" dense borderless label="Buscar filtros">
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
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDataApiStore } from "src/stores/data-api-store";

export default defineComponent({
  name: "FilterBar",
  setup() {
    const route = useRoute();
    const actualRoute = ref(route.name);

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

    const inputSearchBar = ref(null);

    return {
      route,
      actualRoute,
      isFiltering,
      filterDictionary,
      inputSearchBar,
      dataApiStore,
      dataApi,
    };
  },
  methods: {
    defineFilterOptions(filter) {
      if (this.dataApi != null) {
        const allData = this.dataApi
        const options = allData.map((data) => data[filter]);

        if (filter === "properties") {
          const depuredOptions = options.flatMap((value) => {
            return value.flatMap((value2) => {
              return Object.keys(value2).map((key) => {
                if (key === "name") {
                  return value2[key];
                }
              }).filter((element) => element !== undefined);
            });
          });

          const depuredAllOptions = [...new Set(depuredOptions)];
          return depuredAllOptions;
        }

        const depuredAllOptions = [...new Set(options)];
        return depuredAllOptions;
      }
      this.dataApi = this.dataApiStore.getDataApi
      this.defineFilterOptions(filter)
    },
    updateFiltering(filterDictionaryKey = null, filterKey = null) {
      const filters = this.filterDictionary[this.actualRoute];
      this.isFiltering = filters.some((filter) => filter.boxModel);

      if (filterDictionaryKey != null && filterKey != null) {
        if (filterKey === "properties") {
          return this.updatePropertiesFilters(filterDictionaryKey)
        }
        const filteredData = this.dataApi.filter((data) => data[filterKey] === filters[filterDictionaryKey].inputModel)
        if (filteredData.length > 0) {
          this.dataApiStore.setDataApi(filteredData)
          return this.$emit("realodData")
        }
        this.dataApiStore.setDataApi(this.dataApi)
        return this.$emit("realodData")
      }
    },
    updatePropertiesFilters(filterDictionaryKey) {
      const filters = this.filterDictionary[this.actualRoute]
      const selectedProperty = filters[filterDictionaryKey].inputModel

      if (!selectedProperty) {
        this.dataApiStore.setDataApi(this.dataApi)
        return this.$emit("realodData")
      }

      const filteredData = this.dataApi.filter((data) => {
        return data.properties.some((property) => {
          return property.name === selectedProperty;
        });
      });
      console.log(filteredData)

      if (filteredData.length > 0) {
        this.dataApiStore.setDataApi(filteredData);
        this.$emit("realodData");
      } else {
        this.dataApiStore.setDataApi(this.dataApi)
        return this.$emit("realodData")
      }
    },

    getDataBySearchBar() {
      if (this.inputSearchBar == null || this.inputSearchBar == "") {
        this.dataApiStore.setDataApi(this.dataApi)
        return this.$emit("realodData")
      }
      const resultsFilter = this.dataApi.filter((data) => {
        return Object.values(data).some((value) => {
          return String(value).includes(this.inputSearchBar);
        });
      });
      this.dataApiStore.setDataApi(resultsFilter);
      this.$emit("realodData");
    },
  },
});
</script>
