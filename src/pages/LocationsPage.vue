<template>
  <q-page>
    <q-section class="flex justify-between q-pa-md">
      <PageTitle label="Ubicaciones" />
      <div v-if="isMobile">
        <q-btn-group flat>
          <PrimaryButton flat icon="add" class="q-mx-sm" @click="activateDialogNewLocation" />
          <DialogNewLocation ref="dialogNewLocationRef" @locationAdded="getAllLocations()" />
          <PrimaryButton flat icon="more_vert" class="q-mx-sm" />
        </q-btn-group>
      </div>
      <div v-else>
        <q-btn-group flat>
          <PrimaryButton label="Agregar Nueva" icon="add" class="q-mx-sm" @click="activateDialogNewLocation" />
          <DialogNewLocation ref="dialogNewLocationRef" @locationAdded="getAllLocations()" />
          <PrimaryButton flat icon="more_vert" class="q-mx-sm" />
        </q-btn-group>
      </div>
    </q-section>
    <q-section>
      <FilterBar @getAllData="getAllLocations" @realodData="setLocations"></FilterBar>
    </q-section>
    <q-section>
      <DetailsTable section="locations" label="Ubicaciones" :columns="locationColumns" :rows="locationRows" :loading="loadingState"
        @elementDeleted="getAllLocations()"></DetailsTable>
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
import DialogNewLocation from 'src/components/DialogNewLocation.vue'

export default defineComponent({
  name: 'LocationsPage',
  components: {
    PageTitle,
    PrimaryButton,
    FilterBar,
    DetailsTable,
    DialogNewLocation
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

    const stateDialogNewLocation = ref(false)

    const locationColumns = [
      {
        name: 'index',
        label: '#',
        field: 'index'
      },
      { name: 'name', label: 'Nombre', field: 'name', align: 'left' },
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

    const locationRows = ref([])

    const dataApiStore = useDataApiStore()

    const loadingState = ref(false)

    getAllLocations()

    function getAllLocations() {
      loadingState.value = true
      try {
        api
          .get("./locations")
          .then((res) => {
            const data = res.data
            if (data.length > 0) {
              setLocations(data)
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

    function setLocations(data = null) {
      if (data !== null) {
        dataApiStore.setDataApi(data)
      }
      locationRows.value = dataApiStore.getDataApi
      loadingState.value = false
    }

    function formatDate(dateToFormat) {
      return date.formatDate(dateToFormat, 'DD/MMMM/YYYY - hh:mm', {
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      })
    }

    return {
      isMobile,
      locationColumns,
      locationRows,
      loadingState,
      stateDialogNewLocation,
      dataApiStore,
      getAllLocations,
      formatDate,
      setLocations,
    }
  },
  methods: {
    activateDialogNewLocation() {
      this.$refs.dialogNewLocationRef.openDialog();
    },
  }
})
</script>
