<template>
  <q-page>
    <q-section class="flex justify-between q-pa-md">
      <PageTitle label="Categorias" />
      <div v-if="isMobile">
        <q-btn-group flat>
          <PrimaryButton flat icon="add" class="q-mx-sm" @click="activateDialogNewCategory" />
          <DialogNewCategory ref="dialogNewCategoryRef"
            @categoryAdded="() => { getAllCategories(); emitEventUpdateNotifications(); }" />
          <PrimaryButton flat icon="more_vert" class="q-mx-sm" />
        </q-btn-group>
      </div>
      <div v-else>
        <q-btn-group flat>
          <PrimaryButton label="Agregar Nueva" icon="add" class="q-mx-sm" @click="activateDialogNewCategory" />
          <DialogNewCategory ref="dialogNewCategoryRef"
            @categoryAdded="() => { getAllCategories(); emitEventUpdateNotifications(); }" />
          <PrimaryButton flat icon="more_vert" class="q-mx-sm" />
        </q-btn-group>
      </div>
    </q-section>
    <q-section>
      <FilterBar @getAllData="getAllCategories" @realodData="setCategories"></FilterBar>
    </q-section>
    <q-section>
      <DetailsTable section="categories" label="Categorias" :columns="assetColumns" :rows="categoryRows"
        :loading="loadingState" @elementDeleted="() => { getAllCategories(); emitEventUpdateNotifications() }">
      </DetailsTable>
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
        label: 'Fecha de creación',
        field: 'created_at',
        format: (date) => {
          return formatDate(date)
        },
        sortable: true,
        sort: (a, b) => {
          return new Date(b) - new Date(a)
        },
        align: 'left'
      },
      {
        name: 'updated_at',
        label: 'Ultima fecha de modificación',
        field: 'updated_at',
        format: (date) => {
          if (date == null) {
            return 'Sin modificar'
          }
          return formatDate(date)
        },
        sortable: true,
        sort: (a, b) => {
          return new Date(b) - new Date(a)
        },
        align: 'left'
      },
      { name: 'actions', label: '', align: 'left' }
    ]

    const categoryRows = ref([])

    const dataApiStore = useDataApiStore()

    const loadingState = ref(false)

    getAllCategories()

    function getAllCategories() {
      loadingState.value = true
      try {
        api
          .get("./categories")
          .then((res) => {
            const data = res.data
            if (data.length > 0) {
              setCategories(data)
            }
            else if (data.length == 0) {
              dataApiStore.clearDataApi()
              loadingState.value = false
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
      loadingState.value = false
    }

    function formatDate(dateToFormat) {
      return date.formatDate(dateToFormat, 'DD/MMMM/YYYY - HH:mm', {
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      })
    }

    return {
      isMobile,
      assetColumns,
      categoryRows,
      loadingState,
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
    emitEventUpdateNotifications() {
      this.$emit("updateNotifications")
    }
  }
});
</script>
