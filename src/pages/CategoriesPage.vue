<template>
  <q-page>
    <q-section class="flex justify-between q-pa-md">
      <PageTitle label="Categorias" />
      <q-btn-group flat>
        <PrimaryButton label="Agregar Nueva" icon="add" class="q-mx-sm" @click="activateDialogNewCategory" />
        <DialogNewCategory ref="dialogNewCategoryRef" @categoryAdded="getAllCategories()" />
        <PrimaryButton flat icon="more_vert" class="q-mx-sm" />
      </q-btn-group>
    </q-section>
    <q-section>
      <FilterBar @getAllData="getAllCategories" @realodData="setCategories"></FilterBar>
    </q-section>
    <q-section>
      <DetailsTable label="Categorias" :columns="assetColumns" :rows="categoryRows"
        @categoryDeleted="getAllCategories()"></DetailsTable>
    </q-section>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { date } from 'quasar'
import { api } from "src/boot/axios"
import { useDataApiStore } from "src/stores/data-api-store"

import PageTitle from 'src/components/PageTitle.vue'
import PrimaryButton from 'src/components/PrimaryButton.vue'
import FilterBar from 'src/components/FilterBar.vue'
import DetailsTable from 'src/components/DetailsTable.vue'
import DialogNewCategory from 'src/components/DialogNewCategory.vue'

export default defineComponent({
  name: 'CategoriesPage',
  components: {
    PageTitle,
    PrimaryButton,
    FilterBar,
    DetailsTable,
    DialogNewCategory
  },
  setup() {
    const stateDialogNewCategory = ref(false)

    const assetColumns = [
      {
        name: 'index',
        label: '#',
        field: 'index'
      },
      { name: 'name', label: 'Nombre', field: 'name', align: 'left' },
      {
        name: 'properties',
        label: 'Propiedades',
        field: 'properties',
        format: (properties) => {
          const propertiesFormated = properties.map((property, index) => {
            if (index < (properties.length - 1)) {
              return property.name + ", "
            }
            return property.name
          })
          return propertiesFormated
        },
        align: 'left'
      },
      {
        name: 'created_at',
        label: 'Fecha de registro',
        field: 'created_at',
        format: (date) => {
          return formatDate(date)
        },
        align: 'left'
      },
      {
        name: 'updated_at',
        label: 'Fecha de modificacion',
        field: 'updated_at',
        format: (date) => {
          if (date == null) {
            return 'Sin modificar'
          }
          return formatDate(date)
        },
        align: 'left'
      },
      { name: 'actions', label: '', align: 'left' }
    ]

    const categoryRows = ref([])

    const dataApiStore = useDataApiStore()

    getAllCategories()

    function getAllCategories() {
      try {
        api
          .get("./categories")
          .then((res) => {
            const data = res.data
            if (data.length > 0) {
              setCategories(data)
            }
          })
          .catch((err) => {
            console.log(err)
          });
      } catch (error) {
        console.log(error)
      }
    }

    function setCategories(data = null) {
      if (data !== null) {
        dataApiStore.setDataApi(data)
      }
      categoryRows.value = dataApiStore.getDataApi
    }

    function formatDate(dateToFormat) {
      return date.formatDate(dateToFormat, 'DD/MMMM/YYYY - mm:ss', {
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      })
    }

    return {
      assetColumns,
      categoryRows,
      stateDialogNewCategory,
      dataApiStore,
      getAllCategories,
      formatDate,
      setCategories,
    }
  },
  methods: {
    activateDialogNewCategory() {
      this.$refs.dialogNewCategoryRef.openDialog();
    },
  }
})
</script>
